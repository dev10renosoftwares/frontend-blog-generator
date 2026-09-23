import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Query {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In-progress' | 'Resolved' | 'Reach Soon';
  date: string;
}

@Component({
  selector: 'app-raise-query',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './raise-query.html',
  styleUrl: './raise-query.css'
})
export class RaiseQueryComponent {

  /* ========================= */
  /* MODALS */
  /* ========================= */

  showModal = false;

  showDeleteModal = false;


  /* ========================= */
  /* EDIT */
  /* ========================= */

  isEditing = false;

  editingQueryId: string | null = null;


  /* ========================= */
  /* DELETE */
  /* ========================= */

  queryToDelete: Query | null = null;


  /* ========================= */
  /* SEARCH / FILTER */
  /* ========================= */

  searchText = '';

  selectedStatus = 'All';


  /* ========================= */
  /* FORM */
  /* ========================= */

  newQuery = {

    title: '',

    description: ''

  };


  /* ========================= */
  /* QUERIES */
  /* ========================= */

  queries: Query[] = [

    {
      id: 'QRY-1024',
      title: 'Unable to generate blog',
      description:
        'I am getting an error whenever I try to generate a new blog.',
     
      status: 'In-progress',
      date: 'Aug 18, 2026'
    },

    {
      id: 'QRY-1024',
      title: 'Unable to generate blog',
      description:
        'I am getting an error whenever I try to generate a new blog.',
     
      status: 'Pending',
      date: 'Aug 18, 2026'
    },
    {
      id: 'QRY-1004',
      title: 'Unable to generate blog',
      description:
        'I am getting an error whenever I try to generate a new blog.',
     
      status: 'In-progress',
      date: 'Aug 19, 2026'
    },

    {
      id: 'QRY-1018',
      title: 'Credits deducted incorrectly',
      description:
        'My credits were deducted even though the blog was not generated.',
     
      status: 'Resolved',
      date: 'Aug 15, 2026'
    },

    {
      id: 'QRY-1009',
      title: 'Unable to change profile picture',
      description:
        'My profile picture is not updating after uploading a new image.',
   
      status: 'Reach Soon',
      date: 'Aug 12, 2026'
    },

    {
      id: 'QRY-1003',
      title: 'Blog generation taking too long',
      description:
        'The blog generator has been processing my request for a long time.',
     
      status: 'Resolved',
      date: 'Aug 10, 2026'
    },

    {
      id: 'QRY-0998',
      title: 'Credits not showing correctly',
      description:
        'My available credits are not displaying correctly on my dashboard.',
      
      status: 'Pending',
      date: 'Aug 08, 2026'
    }

  ];


  /* ========================= */
  /* OPEN NEW QUERY */
  /* ========================= */

  openQueryModal(): void {

    this.isEditing = false;

    this.editingQueryId = null;

    this.newQuery = {

      title: '',

      description: ''

    };

    this.showModal = true;

  }


  /* ========================= */
  /* EDIT QUERY */
  /* ========================= */

  editQuery(query: Query): void {

    console.log('Editing query:', query);

    this.isEditing = true;

    this.editingQueryId = query.id;

    this.newQuery = {

      title: query.title,

      description: query.description

    };

    this.showModal = true;

  }


  /* ========================= */
  /* CLOSE MODAL */
  /* ========================= */

  closeQueryModal(): void {

    this.showModal = false;

    this.isEditing = false;

    this.editingQueryId = null;

    this.newQuery = {

      title: '',

      description: ''

    };

  }


  /* ========================= */
  /* SUBMIT / UPDATE */
  /* ========================= */

  submitQuery(): void {

    if (
      !this.newQuery.title.trim() ||
 
      !this.newQuery.description.trim()
    ) {

      return;

    }


    /* EDIT */

    if (
      this.isEditing &&
      this.editingQueryId
    ) {

      const index =
        this.queries.findIndex(
          query =>
            query.id === this.editingQueryId
        );


      if (index !== -1) {

        this.queries[index] = {

          ...this.queries[index],

          title: this.newQuery.title,

          description: this.newQuery.description

        };

      }

    }


    /* CREATE */

    else {

      const newQuery: Query = {

        id:
          `QRY-${1000 + this.queries.length + 1}`,

        title:
          this.newQuery.title,

        description:
          this.newQuery.description,

        status:
          'Pending',

        date:
          this.getCurrentDate()

      };


      this.queries.unshift(newQuery);

    }


    this.closeQueryModal();

  }


  /* ========================= */
  /* DELETE CONFIRMATION */
  /* ========================= */

  confirmDelete(query: Query): void {

    console.log('Delete requested:', query);

    this.queryToDelete = query;

    this.showDeleteModal = true;

  }


  /* ========================= */
  /* DELETE */
  /* ========================= */

  deleteQuery(): void {

    if (!this.queryToDelete) {

      return;

    }


    this.queries =
      this.queries.filter(
        query =>
          query.id !==
          this.queryToDelete!.id
      );


    this.queryToDelete = null;

    this.showDeleteModal = false;

  }


  /* ========================= */
  /* CANCEL DELETE */
  /* ========================= */

  cancelDelete(): void {

    this.queryToDelete = null;

    this.showDeleteModal = false;

  }


  /* ========================= */
  /* FILTER */
  /* ========================= */

  filterQueries(status: string): void {

    this.selectedStatus = status;

  }


  /* ========================= */
  /* SEARCH + FILTER */
  /* ========================= */

  filteredQueries(): Query[] {

    return this.queries.filter(query => {

      const matchesStatus =
        this.selectedStatus === 'All' ||
        query.status === this.selectedStatus;


      const search =
        this.searchText
          .toLowerCase()
          .trim();


      const matchesSearch =
        query.title
          .toLowerCase()
          .includes(search)

        ||

        query.description
          .toLowerCase()
          .includes(search)

        ||

        query.id
          .toLowerCase()
          .includes(search);


      return (
        matchesStatus &&
        matchesSearch
      );

    });

  }


  /* ========================= */
  /* STATUS CLASS */
  /* ========================= */

  getStatusClass(status: string): string {

    if (status === 'Pending') {

      return 'pending';

    }

    if (status === 'In-progress') {

      return 'In-progress';

    }
    if (status === 'Resolved') {

      return 'resolved';

    }

    if (status === 'Reach Soon') {

      return 'Reach Soon';

    }

    return '';

  }


  /* ========================= */
  /* COUNT */
  /* ========================= */

  getCount(status: string): number {

    return this.queries.filter(
      query =>
        query.status === status
    ).length;

  }


  /* ========================= */
  /* DATE */
  /* ========================= */

  getCurrentDate(): string {

    return new Date().toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    );

  }

}