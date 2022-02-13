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
  $loggedInLinks.show();
}


// show the new story form when the "submit" link is clicked on the navbar

function showNewStoryForm() {
  hidePageComponents();
  $("#new-story-form").show();
}

submitBtn.on("click", showNewStoryForm);


function handleFavoritesClick(e) {
  hidePageComponents();
  putFavoritesListOnPage();
}

$favoritesBtn.on("click", handleFavoritesClick);

function handleMyStoriesClick(e) {
  hidePageComponents();
  putOwnStoriesOnPage();
};

$MyStoriesBtn.on("click", handleMyStoriesClick);