"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();



  if (currentUser) {
    const isItAFavorite = currentUser.favorites.some(x => x.storyId === story.storyId);
    return $(`
      <li id="${story.storyId}">
      <i class="fa-solid fa-star star ${isItAFavorite ? "favorite" : ""}"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);

  }

  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


//This will grab data from the new story form inputs, call the .addStory method, and add story to the page

async function submitNewStory(event) {
  event.preventDefault();


  const author = $("#author").val().trim();
  const title = $("#title").val().trim();
  const url = $("#url").val().trim();

  await storyList.addStory(currentUser, { title, author, url });

  putStoriesOnPage()
  $newStoryForm.hide();

}

$("#submitBtn").on("click", submitNewStory);


function putFavoritesListOnPage() {
  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}




async function handleStoryFavorite(e) {
  const $target = $(e.target);
  const $storyLi = $target.parent();
  const storyId = $storyLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);


  if ($target.hasClass("favorite")) {
    await currentUser.removeFavorite(story);
    $target.toggleClass("favorite");
  } else {
    await currentUser.addFavorite(story);
    $target.toggleClass("favorite");
  }
}

$('body').on('click', '.star', handleStoryFavorite);


async function handleStoryDelete(e) {
  const $target = $(e.target);
  const $storyLi = $target.parent();
  const storyId = $storyLi.attr("id");
  const story = currentUser.ownStories.find(s => s.storyId === storyId);

  $storyLi.remove();

  await storyList.removeOwnStory(currentUser, storyId);
}

$('body').on('click', '.remove', handleStoryDelete);