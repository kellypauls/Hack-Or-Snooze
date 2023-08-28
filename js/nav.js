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

// function to use the submit button to show form and submit a new story

function submitStoryClick(evt){
  console.debug("submitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", submitStoryClick);

function showFavoriteStories(evt){
  console.debug("showFavoriteStories", evt);
  hidePageComponents();
  addFavoritesListToPage();
  $favoriteStories.show();
}

$navFavorites.on("click", showFavoriteStories);

function showUserStories(evt){
  console.debug("showUserStories", evt);
  hidePageComponents();
  addUserStory();
  $userStories.show();
}

$navUserStories.on("click", showUserStories);

/** Show login/signup on click on "login" */



function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function updateNavOnLogOut() {
  console.debug("updateNavOnLogOut");
  $(".main-nav-links").hide();
}

$navLogOut.on("click", updateNavOnLogOut)