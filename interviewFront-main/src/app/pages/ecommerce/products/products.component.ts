import { Component, OnInit } from '@angular/core';

import { CandidatureService } from '../../../shared/services/candidature.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  candidatures: any

  constructor(private candidatureService: CandidatureService) { }

  ngOnInit() {
    // this.candidatureService.getCandidatures()
    //   .subscribe(candidatures => {
    //     this.candidatures = candidatures;
    //   });
  }
}