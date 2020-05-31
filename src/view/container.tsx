import { h } from 'preact';

import Tabular from '../tabular';
import { BaseComponent, BaseProps } from './base';
import className from '../util/className';
import { Status, TCell } from '../types';
import { Table } from './table/table';
import { HeaderContainer } from './headerContainer';
import { FooterContainer } from './footerContainer';
import Pipeline from '../pipeline/pipeline';
import Header from '../header';
import { Config } from '../config';

interface ContainerProps extends BaseProps {
  config: Config;
  pipeline: Pipeline<Tabular<TCell>>;
  header?: Header;
  width?: string;
}

interface ContainerState {
  status: Status;
  data?: Tabular<TCell>;
}

export class Container extends BaseComponent<ContainerProps, ContainerState> {
  constructor(props) {
    super(props);

    this.state = {
      status: Status.Loading,
      data: null,
    };
  }

  private setData(data: Tabular<TCell>): void {
    this.setState({
      data: data,
      status: Status.Loaded,
    });
  }

  async componentDidMount() {
    this.setData(await this.props.pipeline.process());

    this.props.pipeline.updated(async () => {
      this.setState({
        status: Status.Loading,
      });

      this.setData(await this.props.pipeline.process());
    });
  }

  render() {
    return (
      <div
        className={`${className('container')}${
          this.state.status === Status.Loading ? ' ' + className('loading') : ''
        }`}
        style={{ width: this.props.width }}
      >
        {this.state.status === Status.Loading && (
          <div className={className('loading-bar')} />
        )}

        <HeaderContainer config={this.props.config} />

        <div
          className={className('wrapper')}
          style={{ width: this.props.width }}
        >
          <Table
            pipeline={this.props.pipeline}
            data={this.state.data}
            header={this.props.header}
            width={this.props.width}
            status={this.state.status}
          />

          <FooterContainer config={this.props.config} />
        </div>
      </div>
    );
  }
}
