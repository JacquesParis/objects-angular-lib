import { cloneDeep } from 'lodash-es';
import {
  EditableFormService,
  IGeolocationPosition,
} from './../editable-form.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from 'angular6-json-schema-form';
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import {
  LatLng,
  Map,
  map,
  Marker,
  marker,
  TileLayer,
  tileLayer,
  divIcon,
  DivIcon,
} from 'leaflet';

const NO_POSITION: [number, number] = [50.6311634, 3.0599573];

@Component({
  selector: 'app-widget-position',
  templateUrl: './widget-position.component.html',
  styleUrls: ['./widget-position.component.scss'],
})
export class WidgetPositionComponent implements OnInit, AfterViewInit {
  static lastPosition: [number, number] = undefined;
  public isCollapsed = true;
  modalRef: BsModalRef;
  formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  controlValueText: string = '';
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  currentValue: string;
  latLng: LatLng;
  map: Map;
  marker: Marker;
  osmLayer: TileLayer;
  icon: DivIcon;
  mapEdit: Map;
  markerEdit: Marker<any>;
  hideMap = false;
  hasGeoloc = false;
  initDone: boolean = false;
  private savedLatLng: LatLng;
  public address: string;
  public addressError: string;
  public conditionalValue: { title: string; defaultValue: string };
  public isConditional: boolean = false;
  public displayed: boolean = true;
  default: Function;

  constructor(
    private jsonSchemaFormService: JsonSchemaFormService,
    private localeService: BsLocaleService,
    private modalService: BsModalService,
    private changeDetectorRef: ChangeDetectorRef,
    public editableFormService: EditableFormService
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.jsonSchemaFormService.initializeControl(this);
    this.currentValue = this.controlValue ? this.controlValue : '';
    const values = this.currentValue.split(',');
    if (values.length < 2 || '' === values[0] || '' === values[1]) {
      this.hideMap = true;
    }
    if (navigator?.geolocation?.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        this.hasGeoloc = true;
        if (!WidgetPositionComponent.lastPosition) {
          WidgetPositionComponent.lastPosition = [
            position.coords.latitude,
            position.coords.longitude,
          ];
        }
      });
    }
    if (this.options.conditionalValue) {
      this.conditionalValue = this.options.conditionalValue;
      this.displayed = !!this.controlValue;
      this.isConditional = true;
      if (this.conditionalValue.defaultValue) {
        this.default = new Function(
          'model',
          this.conditionalValue.defaultValue
        );
      }
    }
  }

  locate() {
    navigator.geolocation.getCurrentPosition((position: any) => {
      this.mapEdit.setView([
        position.coords.latitude,
        position.coords.longitude,
      ]);
    });
  }

  async search() {
    this.addressError = null;
    try {
      if (this.address) {
        const position: IGeolocationPosition =
          await this.editableFormService.geocode(this.address);
        this.mapEdit.setView([position.latitude, position.longitude]);
        this.isCollapsed = true;
      }
    } catch (error) {
      this.addressError = error.message;
    }
  }

  private getDefaultPosition(): [number, number] {
    return this.default
      ? this.default(this.jsonSchemaFormService.data).split(',')
      : WidgetPositionComponent.lastPosition
      ? WidgetPositionComponent.lastPosition
      : NO_POSITION;
  }

  ngAfterViewInit() {
    this.map = map('control' + this.layoutNode?._id).setView(
      this.getDefaultPosition(),
      16
    );
    this.icon = divIcon({
      className: 'far fa-dot-circle fa-3x',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    this.osmLayer = tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      // LIGNE 20
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    });

    this.map.addLayer(this.osmLayer);

    const values = this.currentValue.split(',');
    while (2 > values.length) {
      values.push('');
    }
    if ('' !== values[0] && '' !== values[1]) {
      this.latLng = new LatLng(Number(values[0]), Number(values[1]));
      WidgetPositionComponent.lastPosition = [this.latLng.lat, this.latLng.lng];
      this.marker = marker([this.latLng.lat, this.latLng.lng], {
        icon: this.icon,
      });
      this.marker.addTo(this.map);
      this.map.setView(this.latLng);
    } else {
      this.hideMap = true;
    }
    this.initDone = true;
    this.changeDetectorRef.detectChanges();
  }

  cancel() {
    this.updateValue(this.savedLatLng);
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.savedLatLng = this.latLng ? cloneDeep(this.latLng) : undefined;
    this.modalRef = this.modalService.show(template);

    window.setTimeout(() => {
      this.mapEdit = map('edit' + this.layoutNode?._id).setView(
        this.latLng ? this.latLng : this.getDefaultPosition(),
        16
      );
      this.mapEdit.addLayer(
        tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          // LIGNE 20
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        })
      );
      this.markerEdit = marker(this.mapEdit.getCenter(), {
        icon: this.icon,
      });
      this.markerEdit.addTo(this.mapEdit);

      const hiddenSub = this.modalRef.onHidden.subscribe(() => {
        this.markerEdit.remove();
        this.markerEdit = undefined;
        this.mapEdit.remove();
        this.mapEdit = undefined;
        hiddenSub.unsubscribe();
      });
      this.mapEdit.on('move', () => {
        this.updateValue(this.mapEdit.getCenter());
      });
      if (!this.latLng) {
        this.updateValue(this.mapEdit.getCenter());
      }
    });
  }

  remove() {
    this.updateValue(undefined);
  }
  updateValue(event: LatLng) {
    let newValue;
    this.latLng = event;
    if (event) {
      if (this.markerEdit) {
        this.markerEdit.setLatLng(this.latLng);
      }
      if (!this.marker) {
        this.marker = marker([this.latLng.lat, this.latLng.lng], {
          icon: this.icon,
        });
        this.marker.addTo(this.map);
      } else {
        this.marker.setLatLng(this.latLng);
      }
      WidgetPositionComponent.lastPosition = [this.latLng.lat, this.latLng.lng];
      this.map.setView(this.latLng);
      newValue = event.lat + ',' + event.lng;
    } else {
      if (this.marker) {
        this.marker.removeFrom(this.map);
      }
      this.marker = undefined;
      this.latLng = undefined;
      newValue = '';
    }
    if (this.currentValue !== newValue) {
      this.currentValue = newValue;
      this.hideMap = !this.currentValue;
      this.jsonSchemaFormService.updateValue(this, this.currentValue);
    }
  }
  public onDisplayChange(): void {
    if (!this.displayed) {
      this.updateValue(undefined);
    } else if (!this.currentValue) {
      const position = this.getDefaultPosition();
      this.updateValue(new LatLng(position[0], position[1]));
      window.setTimeout(() => {
        this.map.invalidateSize();
      });
    }
  }
}
