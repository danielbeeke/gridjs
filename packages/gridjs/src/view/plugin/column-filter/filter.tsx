import { h } from 'preact';
import GlobalColumnFilter from '../../../pipeline/filter/globalFilter';
import ServerGlobalColumnFilter from '../../../pipeline/filter/serverGlobalFilter';
import { TCell } from '../../../types';
import { PluginBaseComponent, PluginBaseProps } from '../../../plugin';
import {ColumnFilterActions} from "./actions";
import {ColumnFilterStore} from "./store";

export interface ColumnFilterSelect {
  label: string,
  key: string,
  options: { [key: string]: string; } | Promise<{ [key: string]: string; }>
}

export interface ColumnFilterConfig {
  filters?: object;
  selects?: Array<ColumnFilterSelect>
  enabled?: boolean;
  debounceTimeout?: number;
  selector?: (cell: TCell, rowIndex: number, cellIndex: number) => string;
  server?: {
    url?: (prevUrl: string, keyword: string) => string;
    body?: (prevBody: BodyInit, keyword: string) => BodyInit;
  };
}

export class ColumnFilter extends PluginBaseComponent<
  ColumnFilterConfig & PluginBaseProps<ColumnFilter>
> {
  private readonly filterProcessor:
    | GlobalColumnFilter
    | ServerGlobalColumnFilter;
  private readonly actions: ColumnFilterActions;
  private readonly store: ColumnFilterStore;
  private readonly storeUpdatedFn: (...args) => void;

  static defaultProps = {
    debounceTimeout: 250,
  };

  constructor(props, context) {
    super(props, context);

    this.actions = new ColumnFilterActions(this.config.dispatcher);
    this.store = new ColumnFilterStore(this.config.dispatcher);

    const { enabled, filters } = props;

    if (enabled) {
      // initial filters
      if (filters) this.actions.filter(filters);

      this.storeUpdatedFn = this.storeUpdated.bind(this);
      this.store.on('updated', this.storeUpdatedFn);

      let filterProcessor;
      if (props.server) {
        filterProcessor = new ServerGlobalColumnFilter({
          filters: props.filters,
          url: props.server.url,
          body: props.server.body,
        });
      } else {
        filterProcessor = new GlobalColumnFilter({
          filters: props.keyword,
          selector: props.selector,
        });
      }

      this.filterProcessor = filterProcessor;

      // adds a new processor to the pipeline
      this.config.pipeline.register(filterProcessor);
    }
  }

  componentWillUnmount(): void {
    this.config.pipeline.unregister(this.filterProcessor);
    this.store.off('updated', this.storeUpdatedFn);
  }

  private storeUpdated(state: any): void {
    // updates the processor state
    this.filterProcessor.setProps({
      filters: state.filters,
    });
  }

  change(name: string, value: string) {
    const filters = Object.assign({}, this.store.state.filters)
    filters[name] = value
    this.actions.filter(filters);
  }

  render() {
    if (!this.props.enabled) return null;

    for (const select of this.props.selects) {
      if (select.options instanceof Promise) {
        select.options.then(options => {
          select.options = options
          this.forceUpdate()
        })
      }
    }

    return (
      <div>
        {this.props.selects.map(select => {
        return (
          <div className={'column-filter'}>
            <select value={this.store.state.filters[select.key]} onChange={(event) => this.change(select.key, event.currentTarget.value )}>
              <option>- {select.label} -</option>
              {Object.entries(select.options).map(([key, value]) => {
                return (<option value={key}>{value}</option>)
              })}
            </select>
          </div>
        )
        })}
      </div>
    )
  }
}
