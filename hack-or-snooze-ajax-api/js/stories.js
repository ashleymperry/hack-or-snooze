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

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
//HTML delete btn for stories
function getDeleteBtnHTML() {
  return `
    <span class= "trash-can">
      <i class="fas fa-trash-alt"></i>
      </span>`;
}
//Favorite and least favorite star for stories
function getStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class ="star">
      <i class="${starType} fa-star"></i>
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
//Delete story
async function deleteStory(evt){
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);
  putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

//Submit new story form
async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();

  //collect data from form
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = {title, url, author, username};
  const story= await storyList.addUserStory(currentUser, storyData);
  const $story= generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //hife and reset form
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);

//handle user's own stories

function putUserStoriesOnPage(){
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if(currentUser.ownStories.length ===0){
    $ownStories.append("<h4>Nothing has been added!</h5>");
  } else {
    for(let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

//List favorite stories on page

function putFavoritesOnPage(){
  console.debug("putFavoritesOnPage");

  $favoritedStories.empty();

  if(currentUser.favorites.length === 0){
    $favoritedStories.append("<h4>Add favorites to view list!</h4>");
  } else { 
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

//Favorire and unfavorite stories
async function storyFavorite(evt){
  console.debug("storyFavorite");

  const $target = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass("fas")){
    await currentUser.removeFav(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", storyFavorite);