import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(offres: any[], searchTerm: string): any[] {
    if (!offres || !searchTerm) {
      return offres;
    }
    
    // Convert search term to lowercase for case-insensitive search
    searchTerm = searchTerm.toLowerCase();

    return offres.filter(offre =>
      offre.description.toLowerCase().includes(searchTerm) ||
      offre.domaine.toLowerCase().includes(searchTerm) ||
      offre.ville.toLowerCase().includes(searchTerm) ||
      offre.contractType.toLowerCase().includes(searchTerm) ||
      offre.status.toLowerCase().includes(searchTerm)
    );
  }

}
