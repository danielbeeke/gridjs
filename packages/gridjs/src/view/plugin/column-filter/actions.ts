import { BaseActions } from '../../base/actions';

export interface ColumnFilterActionsType {
  COLUMN_FILTER_CHANGE: {
    filters: object;
  };
}

export class ColumnFilterActions extends BaseActions<ColumnFilterActionsType> {
  filter(filters: object): void {
    this.dispatch('COLUMN_FILTER_CHANGE', {
      filters: filters,
    });
  }
}
