import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BlogService } from '../services/createblog';

@Component({
selector: 'app-createprompt',
standalone: true,

imports: [
CommonModule,
FormsModule
],

templateUrl: './createprompt.html',
styleUrl: './createprompt.css'
})
export class Createprompt {

/* =====================================================
USER PROMPT
===================================================== */

prompt = '';

showValidation = false;

isGenerating = false;

/* =====================================================
CONSTRUCTOR
===================================================== */

constructor(
private router: Router,
private blogService: BlogService
) {}

/* =====================================================
USE QUICK SUGGESTION
===================================================== */

useSuggestion(suggestion: string): void {
this.prompt = suggestion;

this.showValidation = false;

}

/* =====================================================
REGENERATE
===================================================== */

regenerate(): void {


const trimmedPrompt = this.prompt.trim();


// ===================================================
// VALIDATE PROMPT
// ===================================================

if (!trimmedPrompt) {

  this.showValidation = true;

  return;

}


this.showValidation = false;

this.isGenerating = true;


// ===================================================
// GET PREVIOUSLY GENERATED BLOG
// ===================================================

const previousResponse =
  this.blogService.getGeneratedBlog();


// ===================================================
// CHECK IF BLOG EXISTS
// ===================================================

if (!previousResponse) {

  this.isGenerating = false;

  this.router.navigate([
    '/create-blog'
  ]);

  return;

}


// ===================================================
// STORE REGENERATION PROMPT
// ===================================================

this.blogService.setRegenerationPrompt(
  trimmedPrompt
);


// ===================================================
// LOG CURRENT BLOG + PROMPT
// ===================================================

console.log(
  'Previous generated blog:',
  previousResponse
);

console.log(
  'Regeneration prompt:',
  trimmedPrompt
);


// ===================================================
// NAVIGATE TO GENERATED BLOG
// ===================================================

setTimeout(() => {

  this.isGenerating = false;

  this.router.navigate([
    '/createdblog'
  ]);

}, 500);


}

/* =====================================================
CANCEL
===================================================== */

cancel(): void {


this.router.navigate([
  '/createdblog'
]);


}

}
