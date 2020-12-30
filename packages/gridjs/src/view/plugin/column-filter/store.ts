import BaseStore from '../../base/store';
import { ColumnFilterActionsType } from './actions';

export type ColumnFilterStoreState = { filters: object | null };

export class ColumnFilterStore extends BaseStore<
  ColumnFilterStoreState,
  ColumnFilterActionsType
> {
  getInitialState(): ColumnFilterStoreState {
    return { filters: null };
  }

  handle(type, payload): void {
    if (type === 'COLUMN_FILTER_CHANGE') {
      const { filters } = payload;
      this.filter(filters);
    }
  }

  private filter(filters: object): void {
    this.setState({ filters: filters });
  }
}
