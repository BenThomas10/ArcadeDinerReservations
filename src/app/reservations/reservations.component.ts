import { Component } from '@angular/core';
import { reservationInformation } from '../models/reservationInfomation';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
})

export class ReservationsComponent {
  visibleReservationCreation: boolean = false;
  visibleReservationUpdate: boolean = false;

  result: boolean = false;
  reservationInformation: reservationInformation[] = [];
  public partyNameVar: string = "";
  public numberInPartyVar: number = 1;
  public reservationDateVar: Date = new Date();
  public reservationTimeVar: Date = new Date();
  public reservationNumberVar: number = 0;
  public emailVar: string = "";
  public isFulfilledVar: boolean = false;
  public reservationIdVar: string = "";
  public minDateVar: string = formatDate(Date.now(),'yyyy-MM-dd','en-US');

  //TODO : these do not work for our time controls.  Wrong format?
  public minTimeVar: string = formatDate("3000000",'HH:mm','en-US');
  public maxTimeVar: string = formatDate("9000000",'HH:mm','en-US');

  constructor() {
    this.viewReservations();
  }

  formatDate(nmbr: number): string {
    var date = nmbr + "";
    date = (date.length < 2) ? "0" + date : date;
    return date;
  }

  viewReservations() {
    if (localStorage.getItem("R&BDiner")) {
      this.reservationInformation = JSON.parse(localStorage.getItem("R&BDiner")!);
      this.reservationInformation = this.reservationInformation.sort((a, b) => new Date(a.reservationDate).getTime() -
        new Date(b.reservationDate).getTime());
    }
  }

  onSubmit(resInfo: reservationInformation) {
    let reservations = JSON.parse(localStorage.getItem("R&BDiner")!) || [];
    resInfo.reservationId = crypto.randomUUID();
    resInfo.isFulfilled = false;
    resInfo.reservationNumber = resInfo.reservationNumber ?? this.getRandomIntInclusive(1000000,9999999);
    reservations.push(resInfo);
    localStorage.setItem("R&BDiner", JSON.stringify(reservations));
    this.viewReservationList();
  }

  onUpdate(resInfo: reservationInformation) {
    const [updateInfo, selectedIndex] = this.getDataAndIndex(resInfo.reservationId);
    updateInfo[selectedIndex] = resInfo;
    localStorage.setItem("R&BDiner", JSON.stringify(updateInfo));
    this.viewReservationList();
  }

  onCancel() {
    this.viewReservationList();
  }

  viewReservationList() {
    this.visibleReservationCreation = false;
    this.visibleReservationUpdate = false;
    this.viewReservations();
  }

  viewCreateReservation() {
    this.visibleReservationCreation = true;
  }

  viewUpdateReservation(reservationId: string) {
    this.visibleReservationUpdate = true;
    const [updateInfo, selectedIndex] = this.getDataAndIndex(reservationId);

    this.partyNameVar = updateInfo[selectedIndex].partyName;
    this.numberInPartyVar = updateInfo[selectedIndex].numberInParty;
    this.reservationDateVar = updateInfo[selectedIndex].reservationDate;
    this.reservationTimeVar = updateInfo[selectedIndex].reservationTime;
    this.reservationNumberVar = updateInfo[selectedIndex].reservationNumber;
    this.emailVar = updateInfo[selectedIndex].email;
    this.isFulfilledVar = updateInfo[selectedIndex].isFulfilled;
    this.reservationIdVar = updateInfo[selectedIndex].reservationId;
  }

  deleteReservation(reservationId: string) {
    const [updateInfo, selectedIndex] = this.getDataAndIndex(reservationId);
    updateInfo.splice(selectedIndex, 1);
    localStorage.setItem("R&BDiner", JSON.stringify(updateInfo));
    this.viewReservationList();
  }

  getDataAndIndex(reservationId: string) {
    let updateInfo = JSON.parse(localStorage.getItem("R&BDiner")!) as reservationInformation[];
    let selectedIndex = updateInfo.findIndex(x => x.reservationId === reservationId)!;
    return [updateInfo, selectedIndex] as const;
  }

  getRandomIntInclusive(min: number, max: number) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    let randomNumber = randomBuffer[0] / (0xffffffff + 1);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
  }
}

