/**
 * JavaScript for the Post Details page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Handle like button clicks
  const likeBtn = document.querySelector('.like-btn');
  if (likeBtn) {
    const postId = likeBtn.getAttribute('data-post-id');
    
    likeBtn.addEventListener('click', async function() {
      try {
        if (!postId) {
          console.error('Post ID not found');
          return;
        }
        
        // If user is not logged in, redirect to login
        if (!document.body.classList.contains('user-logged-in')) {
          window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
          return;
        }
        
        // Check if already liked
        const isLiked = likeBtn.classList.contains('active');
        
        let response;
        if (!isLiked) {
          // Add like
          response = await fetch(`/like/${postId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Find like_id (would be stored in a data attribute in a real implementation)
          const likeId = likeBtn.getAttribute('data-like-id');
          if (!likeId) {
            console.error('Like ID not found for unliking');
            return;
          }
          
          // Remove like
          response = await fetch(`/like/${likeId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (!response.ok) {
          throw new Error('Failed to process like action');
        }
        
        const result = await response.json();
        
        // Update UI
        const likeCountEl = document.querySelector('.like-count') || 
                          likeBtn.querySelector('span');
        
        if (likeCountEl) {
          likeCountEl.textContent = result.likeCount || '0';
        }
        
        // Toggle button state
        likeBtn.classList.toggle('active');
        
        // Update like id if needed
        if (result.likeId) {
          likeBtn.setAttribute('data-like-id', result.likeId);
        } else {
          likeBtn.removeAttribute('data-like-id');
        }
        
      } catch (error) {
        console.error('Error handling like:', error);
        alert('Failed to process like action. Please try again.');
      }
    });
  }

  // Handle comment form submission
  const commentForm = document.querySelector('.comment-form');
  if (commentForm) {
    const postId = commentForm.getAttribute('data-post-id');
    const commentsList = document.querySelector('.card-body .comments-list') || 
                         document.querySelector('.comments-list');
    
    commentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      try {
        const textarea = commentForm.querySelector('textarea');
        const commentContent = textarea.value.trim();
        
        if (!commentContent) {
          alert('Please enter a comment before submitting.');
          return;
        }
        
        if (!postId) {
          console.error('Post ID not found');
          return;
        }
        
        const response = await fetch(`/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            post_id: postId,
            content: commentContent
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
        
        const result = await response.json();
        
        // Clear textarea
        textarea.value = '';
        
        // If we have the comment data and a place to add it
        if (result.comment && commentsList) {
          // Create new comment element
          const newComment = document.createElement('div');
          newComment.className = 'd-flex mb-4';
          
          // Format date
          const commentDate = new Date(result.comment.created_at || new Date()).toLocaleString();
          
          // Build HTML for the new comment
          newComment.innerHTML = `
            <div class="flex-shrink-0">
              <img class="rounded-circle" src="${result.comment.user_avatar || '/img/default-avatar.png'}" alt="User Avatar" width="50" height="50">
            </div>
            <div class="ms-3">
              <div class="fw-bold">${result.comment.username || 'You'}</div>
              <p>${result.comment.content}</p>
              <small class="text-muted">${commentDate}</small>
              <div class="mt-1">
                <button class="btn btn-sm btn-link text-danger delete-comment-btn" data-comment-id="${result.comment.comment_id}">Delete</button>
              </div>
            </div>
          `;
          
          // Add delete event listener to the new button
          const deleteBtn = newComment.querySelector('.delete-comment-btn');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', handleCommentDelete);
          }
          
          // Add to page
          if (commentsList.children.length === 0) {
            // Remove the "No comments" message if it exists
            commentsList.innerHTML = '';
          }
          
          // Add at the beginning of the list
          commentsList.insertBefore(newComment, commentsList.firstChild);
        }
        
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
      }
    });
  }

  // Handle comment deletion
  function handleCommentDelete() {
    const commentId = this.getAttribute('data-comment-id');
    if (!commentId) {
      console.error('Comment ID not found');
      return;
    }
    
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId, this);
    }
  }
  
  async function deleteComment(commentId, buttonElement) {
    try {
      const response = await fetch(`/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      // Remove the comment from the DOM
      const commentElement = buttonElement.closest('.d-flex.mb-4') || 
                          buttonElement.closest('.comment-item');
      if (commentElement && commentElement.parentNode) {
        commentElement.parentNode.removeChild(commentElement);
      }
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  }
  
  // Add event listeners to all delete comment buttons
  document.querySelectorAll('.delete-comment-btn').forEach(button => {
    button.addEventListener('click', handleCommentDelete);
  });

  // Handle post deletion
  const deletePostBtn = document.querySelector('.delete-post-btn');
  if (deletePostBtn) {
    deletePostBtn.addEventListener('click', async function() {
      const postId = this.getAttribute('data-post-id');
      if (!postId) {
        console.error('Post ID not found');
        return;
      }
      
      if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        try {
          const response = await fetch(`/post/${postId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete post');
          }
          
          // Redirect to posts list page
          window.location.href = '/posts';
          
        } catch (error) {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. Please try again.');
        }
      }
    });
  }
}); 