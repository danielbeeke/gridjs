// import search from '../../operator/search';
import Tabular from '../../tabular';
import {
  PipelineProcessor,
  PipelineProcessorProps,
  ProcessorType,
} from '../processor';
import { TCell } from '../../types';

interface GlobalColumnFilterProps extends PipelineProcessorProps {
  filters: object;
  selector?: (cell: TCell, rowIndex: number, cellIndex: number) => string;
}

class GlobalColumnFilter extends PipelineProcessor<
  Tabular,
  GlobalColumnFilterProps
> {
  get type(): ProcessorType {
    return ProcessorType.Filter;
  }

  _process(data: Tabular): Tabular {
    if (this.props.filters) {
      throw new Error('Not yet implemented')
      // return search(
      //   String(this.props.filters).trim(),
      //   data,
      //   this.props.selector,
      // );
    }

    return data;
  }
}

export default GlobalColumnFilter;
