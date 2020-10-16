import Map from 'ol/map';
import Draw from 'ol/interaction/draw';
import Overlay from 'ol/Overlay';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import LineString from 'ol/geom/LineString';
import OverlayPositioning from 'ol/OverlayPositioning';
import * as Sphere from 'ol/sphere';
import { unByKey } from 'ol/Observable';

export class MeasureInteractor extends Draw {
  private helpToolTipElement!: HTMLElement;
  private helpToolTip!: Overlay;
  private measureToolTipElement!: HTMLElement;
  private measureToolTip!: Overlay;

  private pMap: any;
  private listener: any;
  private mapListener: any;
  private skectch: any;
  private selfDistroy: boolean;

  public get map(): Map {
    return this.pMap;
  }

  public set map(value: Map) {
    this.pMap = value;
  }

  constructor(options: any, map: Map, selfDistroy = true) {
    super(options);

    this.map = map;

    this.selfDistroy = selfDistroy;

    this.on('drawstart', (evt) => {
      this.handleDrawing(evt);
    });

    this.on('drawend', () => {
      this.handleFinish();
    });
  }

  public init(): void {
    this.createHelpTooltip();
    this.createMeasureTooltip();

    this.mapListener = this.map.on('pointermove', (evt) => {
      this.pointerMoveHandler(evt as MapBrowserEvent);
    });
  }

  public getActiveState(): boolean {
    return this.getActive();
  }

  public activate(value: boolean) {
    this.setActive(value);
  }

  public pointerMoveHandler(evt: MapBrowserEvent): void {
    if (evt.dragging) {
      return;
    }

    this.helpToolTipElement.innerHTML = 'Click To Start';
    if (this.skectch) {
      this.helpToolTipElement.innerHTML = 'Click to continue drawing the line; Double click to end';
    }
    this.helpToolTip.setPosition(evt.coordinate);

    this.helpToolTipElement.classList.remove('hidden');
  }

  public handleDrawing(evt: any): void {
    if (this.selfDistroy) {
      this.init();
    }
    this.skectch = evt.feature;
    let tooltipCoord = evt.coordinate;
    this.listener = this.skectch.getGeometry().on('change', (event: any) => {
      const geom = event.target;
      const output = this.formatLength(geom);
      this.skectch.set('label', output);
      tooltipCoord = geom.getLastCoordinate();

      this.measureToolTipElement.innerHTML = output;
      this.measureToolTip.setPosition(tooltipCoord);
    });
  }

  public handleFinish(): void {
    this.measureToolTipElement.className = 'tooltip tooltip-static';
    this.helpToolTipElement.innerHTML = 'Click To Start';

    this.destroy();

    if (!this.selfDistroy) {
      this.init();
    }
  }

  public destroy(): void {
    this.skectch = undefined;
    this.measureToolTip.setOffset([0, -7]);
    // unset tooltip so that a new one can be created
    this.measureToolTipElement.remove();
    this.createMeasureTooltip();
    unByKey(this.listener);
    unByKey(this.mapListener);
    this.map.removeOverlay(this.helpToolTip);
  }

  /**
   * Format length output.
   * @param {ol.geom.LineString} line The line.
   * @return {string} The formatted length.
   */
  public formatLength(line: LineString): string {
    const length = Sphere.getLength(line);
    let output: string;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
  }

  /**
   * Creates a new help tooltip
   */
  public createHelpTooltip(): void {
    if (this.helpToolTipElement && this.helpToolTipElement.parentNode) {
      this.helpToolTipElement.parentNode.removeChild(this.helpToolTipElement);
    }
    this.helpToolTipElement = document.createElement('div');
    this.helpToolTipElement.className = 'tooltip hidden';
    this.helpToolTip = new Overlay({
      element: this.helpToolTipElement,
      offset: [15, 0],
      positioning: OverlayPositioning.CENTER_LEFT,
    });
    this.map.addOverlay(this.helpToolTip);
  }

  /**
   * Creates a new measure tooltip
   */
  public createMeasureTooltip(): void {
    if (this.measureToolTipElement && this.measureToolTipElement.parentNode) {
      this.measureToolTipElement.parentNode.removeChild(this.measureToolTipElement);
    }
    this.measureToolTipElement = document.createElement('div');
    this.measureToolTipElement.className = 'tooltip tooltip-measure';
    this.measureToolTip = new Overlay({
      element: this.measureToolTipElement,
      offset: [0, -15],
      positioning: OverlayPositioning.BOTTOM_CENTER,
    });
    this.map.addOverlay(this.measureToolTip);
  }
}
