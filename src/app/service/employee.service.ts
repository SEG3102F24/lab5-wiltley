import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { FirebaseService } from './firebase.service';
import {formatDate} from "@angular/common"; // Import the FirebaseService

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly EMPLOYEES_COLLECTION = 'employees'; // Firestore collection name
  employees$: BehaviorSubject<readonly Employee[]> = new BehaviorSubject<readonly Employee[]>([]);

  constructor(private firebaseService: FirebaseService) {
    this.loadEmployees(); // Load employees on initialization
  }

  // Observable to access the current list of employees
  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  // Add an employee to Firestore and update the local BehaviorSubject
  addEmployee(employee: Employee) {
    const plainEmployeeObject = this.convertEmployeeToPlainObject(employee); // Convert to plain object
    this.firebaseService.addDocument(this.EMPLOYEES_COLLECTION, plainEmployeeObject).then(() => {
      this.employees$.next([...this.employees$.getValue(), employee]);
    });
    return true;
  }

  // Load employees from Firestore and map them to Employee model
  // Load employees from Firestore and map them to Employee model
  private loadEmployees() {
    this.firebaseService.getDocuments(this.EMPLOYEES_COLLECTION).then((docs: { id: string; [key: string]: any }[]) => {
      // Map Firestore documents to Employee objects
      const employees: Employee[] = docs.map(doc => ({
        id: doc.id, // Include Firestore document ID
        name: doc['name'] || '', // Ensure all fields are mapped safely
        dateOfBirth: doc['dateOfBirth'] || '', // Use defaults if fields are missing
        city: doc['city'] || '',
        email: doc['email'] || '',
        gender: doc['gender'] || '',
        salary: doc['salary'] || 0
      }));
      this.employees$.next(employees); // Update the BehaviorSubject with loaded employees
    }).catch(error => {
      console.error('Error loading employees:', error);
    });
  }

  // Convert the custom Employee class to a plain object
  private convertEmployeeToPlainObject(employee: Employee): any {
    return {
      name: employee.name,
      dateOfBirth: this.formatDate(employee.dateOfBirth),
      city: employee.city,
      salary: employee.salary
    };
  }
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit day
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two-digit month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}



