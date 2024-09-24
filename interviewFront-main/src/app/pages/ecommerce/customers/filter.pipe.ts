import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(users:any, searchTerm: string,candidatures : any): any {
    if (!users || !searchTerm) {
      return users;
    }

    searchTerm = searchTerm.toLowerCase();

    return users.filter(user =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone.includes(searchTerm)
    );
  }
}
