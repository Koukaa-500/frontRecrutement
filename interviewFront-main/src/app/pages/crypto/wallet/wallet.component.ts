import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { SortEvent, WalletSortableService } from './wallet-sortable.directive';
import { WalletService } from './wallet.service';

import { Activities, ChartType } from './wallet.model';

import { Offre } from 'src/app/shared/classes/offre';
import { OffreService } from 'src/app/shared/services/offre.service';
import { OveviewChart, activitiesData } from './data';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  providers: [WalletService, DecimalPipe]
})
export class WalletComponent implements OnInit {
  Offres:any;

  // breadcrumb items
  breadCrumbItems: Array<{}>;
  OveviewChart: ChartType;

  activitiesData: Activities[];

  activities$: Observable<Activities[]>;
  total: Observable<number>;

  offre={} as Offre;

  @ViewChildren(WalletSortableService) headers: QueryList<WalletSortableService>;

  constructor(public service: WalletService, private offreService:OffreService) {
    this.activities$ = service.activities$;
    this.total = service.total$;
// get all offres
    this.offreService.getOffres().subscribe(data=>{
      this.Offres = data;
      console.log(this.Offres);
    })


  }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'Wallets', active: true }];

    this.OveviewChart = OveviewChart;
    this.activitiesData = activitiesData;
  }

  /**
 * Sort table data
 * @param param0 sort the column
 *
 */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  addOffre(){
    // this.offreService.addOffre(this.offre,parseInt(localStorage.getItem("id"))).subscribe(
    //   response=>{
    //     console.log("offre ajouté avec succés",response);
    //   }
    // )
  }
  deleteOffre(id:any){
    if(confirm("Voulez-vous vraiment supprimer cette offre?"))
      {
    this.offreService.deleteOffre(id).subscribe(
      response=>{
        console.log("offre supprimé avec succés",response);
      }
    )
  }
  }
}
