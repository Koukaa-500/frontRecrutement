import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(jobsData: any[], searchTerm: string): any[] {
    if (!jobsData || !searchTerm) {
      return jobsData;
    }

    searchTerm = searchTerm.toLowerCase();

    return jobsData.filter(job =>
      job.description.toLowerCase().includes(searchTerm) ||
      job.domaine.toLowerCase().includes(searchTerm)
    );
  }
}
