// post-details.js
document.addEventListener('DOMContentLoaded', () => {
    // Xử lý nút Like
    const likeBtn = document.querySelector('.like-btn');
    const likeCount = document.querySelector('.like-count');
    const postId = likeBtn.dataset.postId;
  
    likeBtn.addEventListener('click', async () => {
      try {
        if (likeBtn.classList.contains('liked')) {
          // Xóa like
          const response = await fetch(`/api/likes/${postId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            likeBtn.classList.remove('liked');
            updateLikeCount(postId);
          }
        } else {
          // Thêm like
          const response = await fetch(`/api/likes/${postId}`, {
            method: 'POST',
          });
          if (response.ok) {
            likeBtn.classList.add('liked');
            updateLikeCount(postId);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    // Xử lý form bình luận
    const commentForm = document.querySelector('.comment-form');
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = commentForm.querySelector('textarea').value;
      
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: postId,
            user_id: 2, // Giả sử user_id hiện tại là 2
            parent_id: 3, // Giả sử parent_id là 3
            content: content
          })
        });
  
        if (response.ok) {
          commentForm.reset();
          loadComments(postId);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    // Hàm cập nhật số like
    async function updateLikeCount(postId) {
      const response = await fetch(`/api/likes/${postId}`);
      const data = await response.json();
      likeCount.textContent = data.likeCount;
    }
  
    // Hàm tải danh sách comment
    async function loadComments(postId) {
      const response = await fetch(`/api/comments/${postId}`);
      const comments = await response.json();
      const commentsList = document.querySelector('.comments-list');
      commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
          <p>${comment.content}</p>
          <small>Bởi user ${comment.user_id}</small>
        </div>
      `).join('');
    }
  
    // Load initial comments
    loadComments(postId);
  });