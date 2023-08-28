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

function generateStoryMarkup(story, showRemove = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const star = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      <div>
      ${showRemove ? showRemoveBtnHTML() : ""}
      ${star ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function showRemoveBtnHTML(){
  return `
  <span class="trash-can">
  <i class="fas fa-trash-alt"></i>
  </span>`
}

function getStarHTML(story, user){
  const favorite = user.isFavorite(story);
  const starType = favorite ? "fas" : "far";
  return `
  <span class="star">
  <i class="${starType}
  fa-star"></i>
  </span>`;
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

async function removeStory(evt){
  console.debug("removeStory")
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await addUserStory();

}

$userStories.on("click", ".trash-can", removeStory);

// submit story form 

async function createNewStory(evt){
  evt.preventDefault();

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const username = currentUser.username;
  const storyInfo = {  title, author, url, username };

  const createdStory = await storyList.addStory(currentUser, storyInfo);

  const $story = generateStoryMarkup(createdStory);
  $allStoriesList.prepend($story);
  $submitForm.trigger("reset");
}

$submitForm.on("submit", createNewStory)

//adding user stories to the stories list.

function addUserStory(){
  console.debug(addUserStory);
  $userStories.empty();

  if(currentUser.ownStories.length === 0){
    $userStories.append("<h4>No stories have been added by the user yet..")
  } else {
    for (let story of currentUser.ownStories){
      let $userStory = generateStoryMarkup(story, true);
      $userStories.append($userStory);
    }
  }
  $userStories.show();
}
//function to check status of starred stories

async function storyFavoriteToggle(e) {

const $target = $(e.target);
const $li = $target.closest("li");
const storyId = $li.attr("id");
const story = storyList.stories.find(s => s.storyId === storyId);

if($target.hasClass("fas")){
  await currentUser.removeFavorite(story);
  $target.closest("i").toggleClass("far fas");
} else {
  await currentUser.addFavorite(story);
  $target.closest("i").toggleClass("fas far");
}
}

$storiesList.on("click", ".star", storyFavoriteToggle);

function addFavoritesListToPage (){
  console.debug("addFavoritesListToPage")
  $favoriteStories.empty();
  if( currentUser.favorites.length === 0){
    $favoriteStories.append("<h4>No favorites have been added yet!</h4>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story)
    }
  }
  $favoriteStories.show();
};