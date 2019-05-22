import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ResizeDetector from 'react-resize-detector';
import { Hotkeys } from '../ui-kit/hotkeys';
import { HeaderArea } from './header-area/HeaderArea';
import { ChartArea } from './chart-area/ChartArea';
import { Export } from './export/Export';
import * as Action from '../../action';
import { Diff } from '../ui-kit/movable';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

export class GanttChart extends React.PureComponent {
  private header = React.createRef<HTMLDivElement>();
  private chart = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <>
        <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <Hotkeys
          scope="root"
          keymap={Action.Hotkey.keyMap}
          listeners={Action.Hotkey.handlers}
        >
          <Self className="GanttChart">
            <HeaderArea ref={this.header} onMoving={this.onHeaderAreaMoving} />
            <ChartArea ref={this.chart} onMoving={this.onChartAreaMoving} />
            <Export />
          </Self>
        </Hotkeys>
        <GlobalStyle />
      </>
    );
  }

  private onResize = (width: number, height: number) => {
    Action.UI.updateViewport({ width, height });
  };

  private onHeaderAreaMoving = (_: MouseEvent, diff: Diff) => {
    if (this.header.current) {
      this.header.current.scrollLeft += diff.x;
    }
    this.syncY(this.header, this.chart, diff.y);
  };

  private onChartAreaMoving = (_: MouseEvent, diff: Diff) => {
    Action.UI.updateCurrentTime(diff.x);
    this.syncY(this.chart, this.header, diff.y);
  };

  private syncY = (
    from: React.RefObject<HTMLDivElement>,
    to: React.RefObject<HTMLDivElement>,
    diffY: number
  ) => {
    if (from.current && to.current) {
      from.current.scrollTop += diffY;
      to.current.scrollTop = from.current.scrollTop;
    }
  };
}

const Self = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 8px;
`;
