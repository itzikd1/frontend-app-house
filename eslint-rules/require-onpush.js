/**
 * ESLint rule: require ChangeDetectionStrategy.OnPush in Angular components
 * This rule checks for the presence of 'changeDetection: ChangeDetectionStrategy.OnPush' in @Component decorators.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require ChangeDetectionStrategy.OnPush in Angular components',
      category: 'Best Practices',
      recommended: true
    },
    schema: [],
    messages: {
      missingOnPush: 'Angular component is missing ChangeDetectionStrategy.OnPush.'
    }
  },
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!node.decorators) return;
        for (const decorator of node.decorators) {
          if (
            decorator.expression &&
            decorator.expression.callee &&
            decorator.expression.callee.name === 'Component'
          ) {
            const args = decorator.expression.arguments;
            if (!args || args.length === 0) return;
            const config = args[0];
            if (config.type !== 'ObjectExpression') return;
            const hasOnPush = config.properties.some(prop => {
              return (
                prop.key &&
                prop.key.name === 'changeDetection' &&
                prop.value &&
                prop.value.type === 'MemberExpression' &&
                prop.value.object.name === 'ChangeDetectionStrategy' &&
                prop.value.property.name === 'OnPush'
              );
            });
            if (!hasOnPush) {
              context.report({
                node,
                messageId: 'missingOnPush'
              });
            }
          }
        }
      }
    };
  }
};

