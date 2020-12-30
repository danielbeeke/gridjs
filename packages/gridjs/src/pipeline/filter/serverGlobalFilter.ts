import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { ServerStorageOptions } from '../../storage/server';

interface ServerGlobalColumnFilterProps extends PipelineProcessorProps {
  filters?: object;
  url?: (prevUrl: string, filters: object) => string;
  body?: (prevBody: BodyInit, filters: object) => BodyInit;
}

class ServerGlobalColumnFilter extends PipelineProcessor<
  ServerStorageOptions,
  ServerGlobalColumnFilterProps
> {
  get type(): ProcessorType {
    return ProcessorType.ServerFilter;
  }

  _process(options?: ServerStorageOptions): ServerStorageOptions {
    if (!this.props.filters) return options;

    const updates = {};

    if (this.props.url) {
      updates['url'] = this.props.url(options.url, this.props.filters);
    }

    if (this.props.body) {
      updates['body'] = this.props.body(options.body, this.props.filters);
    }

    return {
      ...options,
      ...updates,
    };
  }
}

export default ServerGlobalColumnFilter;
