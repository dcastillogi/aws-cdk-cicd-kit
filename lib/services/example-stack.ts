import { Construct } from 'constructs';
import { BaseStack, BaseStackProps } from '@/lib/constructs/base-stack';

export class ExampleStack extends BaseStack {
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    // Example usage:
    // const tableName = this.resourceName({ resource: 'orders-table' });
    // const readCapacity = this.envConfig.capacity.minCapacity;
  }
}
