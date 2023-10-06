"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

//handle story submit

function navSubmitStoryClk(evt){
  console.debug("navSubmitStoryClk", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
$navSubmitStory.on("click", navSubmitStoryClk);

//handle favorites click
function navFavoritesClk(evt){
  console.debug("navFavoritesClk", evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$body.on("click", "#nav-favorites", navFavoritesClk);

//handle my stories click
function navMyStories(evt){
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

//handle profile click
function navProfileClk(evt){
console.debug("navProfileClk", evt);
hidePageComponents();
$userProfile.show();
}
$navUserProfile.on("click", navProfileClk);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
