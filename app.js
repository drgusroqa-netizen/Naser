// App State
const appState = {
    currentUser: {
        id: '1',
        username: 'مستخدم جديد',
        handle: '@newuser',
        avatar: 'https://via.placeholder.com/120?text=User',
        bio: 'مرحبا، أنا مستخدم جديد في المنصة',
        followers: 150,
        following: 120,
        posts: 45
    },
    posts: [],
    users: [],
    messages: {},
    currentChat: null
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    generateMockData();
    renderHome();
});

// Initialize app
function initializeApp() {
    // Load from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    // Create post modal
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');

    createPostBtn.addEventListener('click', () => {
        createPostModal.classList.add('active');
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    cancelButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Post creation
    document.getElementById('imageUploadBtn').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });

    document.getElementById('videoReelBtn').addEventListener('click', () => {
        document.getElementById('videoInput').click();
    });

    document.getElementById('storyBtn').addEventListener('click', () => {
        createStory();
    });

    document.getElementById('imageInput').addEventListener('change', (e) => {
        handleMediaUpload(e, 'image');
    });

    document.getElementById('videoInput').addEventListener('change', (e) => {
        handleMediaUpload(e, 'video');
    });

    document.getElementById('submitPostBtn').addEventListener('click', submitPost);

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchUsers(e.target.value);
    });

    // Logout
    document.querySelector('.logout-btn').addEventListener('click', logout);
}

// Generate mock data
function generateMockData() {
    // Mock users
    appState.users = [
        {
            id: '2',
            username: 'أحمد محمد',
            handle: '@ahmadmohammad',
            avatar: 'https://via.placeholder.com/80?text=Ahmed',
            following: false,
            followers: 500
        },
        {
            id: '3',
            username: 'فاطمة علي',
            handle: '@fatimaali',
            avatar: 'https://via.placeholder.com/80?text=Fatima',
            following: false,
            followers: 350
        },
        {
            id: '4',
            username: 'محمود حسن',
            handle: '@mahmoudhassan',
            avatar: 'https://via.placeholder.com/80?text=Mahmoud',
            following: true,
            followers: 420
        },
        {
            id: '5',
            username: 'سارة إبراهيم',
            handle: '@sarahib',
            avatar: 'https://via.placeholder.com/80?text=Sarah',
            following: false,
            followers: 280
        },
        {
            id: '6',
            username: 'علي خالد',
            handle: '@alikhalid',
            avatar: 'https://via.placeholder.com/80?text=Ali',
            following: true,
            followers: 610
        }
    ];

    // Mock posts
    appState.posts = [
        {
            id: '1',
            author: appState.users[0],
            text: 'هذا منشور رائع جداً! أنا أحب هذه المنصة الجديدة',
            image: 'https://via.placeholder.com/600x400?text=Post+1',
            likes: 245,
            comments: 32,
            shares: 15,
            liked: false,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
            id: '2',
            author: appState.users[1],
            text: 'اليوم كان يوم رائع مع الأصدقاء! 🎉',
            video: 'https://via.placeholder.com/600x400?text=Video+Reel',
            likes: 567,
            comments: 89,
            shares: 45,
            liked: false,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
            id: '3',
            author: appState.users[2],
            text: 'تعلمت شيء جديد اليوم عن البرمجة! 💻',
            image: 'https://via.placeholder.com/600x400?text=Post+3',
            likes: 432,
            comments: 56,
            shares: 23,
            liked: false,
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
        }
    ];

    // Mock messages
    appState.messages = {
        '2': [
            { sender: '2', text: 'مرحبا! كيف حالك؟', timestamp: new Date(Date.now() - 10 * 60 * 1000) },
            { sender: '1', text: 'أنا بخير، شكراً للسؤال!', timestamp: new Date(Date.now() - 9 * 60 * 1000) },
            { sender: '2', text: 'هل تريد أن تلتقي غداً؟', timestamp: new Date(Date.now() - 5 * 60 * 1000) }
        ],
        '3': [
            { sender: '3', text: 'مرحبا! كيف الأحوال؟', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) }
        ],
        '4': [
            { sender: '1', text: 'مرحبا أحمد!', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
            { sender: '4', text: 'مرحبا! كيف حالك؟', timestamp: new Date(Date.now() - 28 * 60 * 1000) }
        ]
    };
}

// Navigation
function navigateTo(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(page).classList.add('active');

    // Render content
    switch(page) {
        case 'home':
            renderHome();
            break;
        case 'explore':
            renderExplore();
            break;
        case 'messages':
            renderMessages();
            break;
        case 'profile':
            renderProfile();
            break;
    }
}

// Render home feed
function renderHome() {
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';

    appState.posts.forEach(post => {
        const postEl = createPostElement(post);
        feedContainer.appendChild(postEl);
    });
}

// Create post element
function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post';

    const timeAgo = getTimeAgo(post.timestamp);

    let mediaHTML = '';
    if (post.image) {
        mediaHTML = `<img src="${post.image}" alt="Post image" class="post-media">`;
    } else if (post.video) {
        mediaHTML = `<video class="post-media" controls><source src="${post.video}" type="video/mp4"></video>`;
    }

    div.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${post.author.avatar}" alt="${post.author.username}" class="post-author-avatar">
                <div class="post-author-info">
                    <div class="post-author-name">${post.author.username}</div>
                    <div class="post-author-time">${timeAgo}</div>
                </div>
            </div>
            <button class="post-more-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        <div class="post-content">
            <div class="post-text">${post.text}</div>
            ${mediaHTML}
        </div>
        <div class="post-footer">
            <button class="post-action ${post.liked ? 'liked' : ''}" onclick="toggleLike(this, '${post.id}')">
                <i class="fas fa-heart"></i>
                <span>${post.likes}</span>
            </button>
            <button class="post-action">
                <i class="fas fa-comment"></i>
                <span>${post.comments}</span>
            </button>
            <button class="post-action">
                <i class="fas fa-share"></i>
                <span>${post.shares}</span>
            </button>
        </div>
    `;

    return div;
}

// Toggle like
function toggleLike(btn, postId) {
    const post = appState.posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;

        btn.classList.toggle('liked');
        btn.querySelector('span').textContent = post.likes;
    }
}

// Handle media upload
function handleMediaUpload(e, type) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('mediaPreview');
            preview.innerHTML = '';

            if (type === 'image') {
                const img = document.createElement('img');
                img.src = event.target.result;
                preview.appendChild(img);
            } else if (type === 'video') {
                const video = document.createElement('video');
                video.src = event.target.result;
                video.controls = true;
                preview.appendChild(video);
            }

            // Store in state
            if (type === 'image') {
                document.getElementById('postText').dataset.image = event.target.result;
            } else {
                document.getElementById('postText').dataset.video = event.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Submit post
function submitPost() {
    const text = document.getElementById('postText').value;
    const textarea = document.getElementById('postText');
    const image = textarea.dataset.image;
    const video = textarea.dataset.video;

    if (!text && !image && !video) {
        alert('الرجاء كتابة نص أو إضافة صورة/فيديو');
        return;
    }

    const newPost = {
        id: String(appState.posts.length + 1),
        author: appState.currentUser,
        text: text,
        image: image,
        video: video,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        timestamp: new Date()
    };

    appState.posts.unshift(newPost);

    // Clear form
    document.getElementById('postText').value = '';
    document.getElementById('postText').removeAttribute('data-image');
    document.getElementById('postText').removeAttribute('data-video');
    document.getElementById('mediaPreview').innerHTML = '';

    // Close modal
    document.getElementById('createPostModal').classList.remove('active');

    // Re-render home
    renderHome();
}

// Create story
function createStory() {
    const text = document.getElementById('postText').value;
    if (!text) {
        alert('الرجاء كتابة محتوى للقصة');
        return;
    }

    alert('تم إضافة قصة جديدة بنجاح! ستختفي بعد 24 ساعة');
    document.getElementById('postText').value = '';
    document.getElementById('createPostModal').classList.remove('active');
}

// Render explore
function renderExplore() {
    const usersGrid = document.getElementById('usersGrid');
    usersGrid.innerHTML = '';

    appState.users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
            <div class="user-name">${user.username}</div>
            <div class="user-handle">${user.handle}</div>
            <div class="user-handle" style="font-size: 12px; color: #999; margin-bottom: 10px;">
                ${user.followers} متابع
            </div>
            <div class="user-actions">
                <button class="user-follow-btn ${user.following ? 'following' : ''}" onclick="toggleFollow('${user.id}')">
                    ${user.following ? 'متابع' : 'متابعة'}
                </button>
                <button class="user-message-btn" onclick="openChat('${user.id}')">
                    <i class="fas fa-envelope"></i>
                </button>
            </div>
        `;
        usersGrid.appendChild(userCard);
    });
}

// Toggle follow
function toggleFollow(userId) {
    const user = appState.users.find(u => u.id === userId);
    if (user) {
        user.following = !user.following;
        renderExplore();
    }
}

// Search users
function searchUsers(query) {
    const filtered = appState.users.filter(user => 
        user.username.includes(query) || user.handle.includes(query)
    );

    const usersGrid = document.getElementById('usersGrid');
    usersGrid.innerHTML = '';

    if (filtered.length === 0 && query) {
        usersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">لا توجد نتائج</p>';
        return;
    }

    filtered.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
            <div class="user-name">${user.username}</div>
            <div class="user-handle">${user.handle}</div>
            <div class="user-handle" style="font-size: 12px; color: #999; margin-bottom: 10px;">
                ${user.followers} متابع
            </div>
            <div class="user-actions">
                <button class="user-follow-btn ${user.following ? 'following' : ''}" onclick="toggleFollow('${user.id}')">
                    ${user.following ? 'متابع' : 'متابعة'}
                </button>
                <button class="user-message-btn" onclick="openChat('${user.id}')">
                    <i class="fas fa-envelope"></i>
                </button>
            </div>
        `;
        usersGrid.appendChild(userCard);
    });
}

// Render messages
function renderMessages() {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';

    Object.keys(appState.messages).forEach(userId => {
        const user = appState.users.find(u => u.id === userId);
        if (user) {
            const messages = appState.messages[userId];
            const lastMessage = messages[messages.length - 1];
            const preview = lastMessage.text.substring(0, 30) + (lastMessage.text.length > 30 ? '...' : '');

            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.innerHTML = `
                <img src="${user.avatar}" alt="${user.username}" class="message-avatar">
                <div class="message-info">
                    <div class="message-name">${user.username}</div>
                    <div class="message-preview">${preview}</div>
                </div>
            `;
            messageItem.addEventListener('click', () => openChat(userId));
            messagesList.appendChild(messageItem);
        }
    });
}

// Open chat
function openChat(userId) {
    appState.currentChat = userId;
    const user = appState.users.find(u => u.id === userId);
    const messageModal = document.getElementById('messageModal');

    document.getElementById('messageUserName').textContent = user.username;
    const messagesDisplay = document.getElementById('messagesDisplay');
    messagesDisplay.innerHTML = '';

    const messages = appState.messages[userId] || [];
    messages.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${msg.sender === '1' ? 'sent' : 'received'}`;
        bubble.innerHTML = `<div class="message-text">${msg.text}</div>`;
        messagesDisplay.appendChild(bubble);
    });

    // Setup send button
    const sendBtn = messageModal.querySelector('.send-btn');
    sendBtn.onclick = () => sendMessage(userId);

    const messageInput = messageModal.querySelector('.message-input');
    messageInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            sendMessage(userId);
        }
    };

    messageModal.classList.add('active');
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
}

// Send message
function sendMessage(userId) {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text) return;

    if (!appState.messages[userId]) {
        appState.messages[userId] = [];
    }

    appState.messages[userId].push({
        sender: '1',
        text: text,
        timestamp: new Date()
    });

    input.value = '';

    // Update display
    const messagesDisplay = document.getElementById('messagesDisplay');
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble sent';
    bubble.innerHTML = `<div class="message-text">${text}</div>`;
    messagesDisplay.appendChild(bubble);
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
}

// Render profile
function renderProfile() {
    const profileContainer = document.getElementById('profileContainer');
    const user = appState.currentUser;

    profileContainer.innerHTML = `
        <div class="profile-header">
            <div class="profile-cover"></div>
            <div class="profile-info">
                <img src="${user.avatar}" alt="${user.username}" class="profile-avatar">
                <div class="profile-name">${user.username}</div>
                <div class="profile-handle">${user.handle}</div>
                <div class="profile-bio">${user.bio}</div>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <div class="profile-stat-number">${user.posts}</div>
                        <div class="profile-stat-label">منشور</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat-number">${user.followers}</div>
                        <div class="profile-stat-label">متابع</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat-number">${user.following}</div>
                        <div class="profile-stat-label">يتابع</div>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="edit-profile-btn" onclick="openEditProfile()">تعديل الملف الشخصي</button>
                </div>
            </div>
        </div>
        <div class="profile-posts">
            <h3 style="margin-top: 30px; margin-bottom: 20px;">المنشورات</h3>
            <div id="profileFeed"></div>
        </div>
    `;

    // Render user's posts
    const userPosts = appState.posts.filter(p => p.author.id === user.id);
    const profileFeed = document.getElementById('profileFeed');
    
    if (userPosts.length === 0) {
        profileFeed.innerHTML = '<p style="text-align: center; color: #999;">لا توجد منشورات حتى الآن</p>';
    } else {
        userPosts.forEach(post => {
            profileFeed.appendChild(createPostElement(post));
        });
    }
}

// Open edit profile
function openEditProfile() {
    const user = appState.currentUser;
    const modal = document.getElementById('editProfileModal');

    document.getElementById('profilePicPreview').src = user.avatar;
    document.getElementById('usernameInput').value = user.username;
    document.getElementById('bioInput').value = user.bio;

    modal.classList.add('active');

    // Profile pic upload
    document.querySelector('.upload-pic-btn').addEventListener('click', () => {
        document.getElementById('profilePicInput').click();
    });

    document.getElementById('profilePicInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('profilePicPreview').src = event.target.result;
                appState.currentUser.avatar = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save profile
    document.getElementById('saveProfileBtn').addEventListener('click', () => {
        const username = document.getElementById('usernameInput').value;
        const bio = document.getElementById('bioInput').value;

        if (!username) {
            alert('الرجاء إدخال اسم المستخدم');
            return;
        }

        appState.currentUser.username = username;
        appState.currentUser.bio = bio;

        localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));

        alert('تم تحديث الملف الشخصي بنجاح!');
        modal.classList.remove('active');
        renderProfile();
    });
}

// Utility functions
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'الآن';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' دقيقة';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' ساعة';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + ' يوم';
    
    return new Intl.DateTimeFormat('ar-SA').format(date);
}

// Logout
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('currentUser');
        alert('تم تسجيل الخروج بنجاح');
        location.reload();
    }
}

// Close modals on background click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
