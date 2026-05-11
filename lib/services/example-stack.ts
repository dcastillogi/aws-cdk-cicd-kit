import { Construct } from 'constructs';
import { BaseStack, BaseStackProps } from '../constructs/base-stack';

export class ExampleStack extends BaseStack {
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    // Example usage:
    // const tableName = this.resourceName('orders-table');
    // const readCapacity = this.byEnv({ dev: 1, qa: 1, prod: 5 });
  }
}
