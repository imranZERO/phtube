let videos = [];
let buttonsAdded = false;

const getCategoryCode = async (category) => {
	const res = await fetch("https://openapi.programming-hero.com/api/videos/categories");
	const data = await res.json();
	const categories = data.data;

	// add all of the category buttons
	if (!buttonsAdded) {
		for (let i = 0; i < categories.length; i++) {
				const name = categories[i].category;
				addButton(name);
		}
		buttonsAdded = true;
	}

	// get code/slug for every category
	for (let i = 0; i < categories.length; i++) {
		const name = categories[i].category;
		const id = categories[i].category_id;
		if (name === category) {
			loadCards(id);
		}
	}
}

const loadFirstCategory = async () => {
	const res = await fetch("https://openapi.programming-hero.com/api/videos/categories");
	const data = await res.json();
	const categories = data.data;

	const firstBtn = categories[0].category_id;
	loadCards(firstBtn);
}

function addButton(name) {
	const btnList = document.getElementById("button-list");
	const btn = document.createElement("button");
	btn.id = name;
	btn.classList = "btn normal-case text-base font-medium rounded-md";
	btn.onclick = function () {
		getCategoryCode(name);
	}
	btn.innerHTML = `${name}`;
	btnList.appendChild(btn);
}

const loadCards = async (categoryCode) => {
	const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryCode}`);
	const data = await res.json();
	videos = data.data;
	displayVideos(videos);
}

const displayVideos = (videos) => {
	const videoContainer = document.getElementById("video-container");

	videoContainer.textContent = '';

	if (videos.length === 0) {
		const emptyMsg = document.createElement("div");
		emptyMsg.classList = "my-32 text-center";
		emptyMsg.innerHTML = `
			<img class="mx-auto" src="./images/Icon.png" alt="">
			<h2 class="my-8 font-bold text-3xl text-[#171717]">Oops!! Sorry, There is no content here</h2>
		`
		videoContainer.classList = "flex justify-center";
		videoContainer.appendChild(emptyMsg);
	}

	function isVerified(video) {
		if (video.authors[0]?.verified) {
			return '<svg class="inline" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_11_215)"> <path d="M19.375 10.0001C19.375 10.8001 18.3922 11.4595 18.1953 12.197C17.9922 12.9595 18.5063 14.022 18.1203 14.6892C17.7281 15.3673 16.5484 15.4486 15.9984 15.9986C15.4484 16.5486 15.3672 17.7282 14.6891 18.1204C14.0219 18.5064 12.9594 17.9923 12.1969 18.1954C11.4594 18.3923 10.8 19.3751 10 19.3751C9.2 19.3751 8.54062 18.3923 7.80312 18.1954C7.04062 17.9923 5.97813 18.5064 5.31094 18.1204C4.63281 17.7282 4.55156 16.5486 4.00156 15.9986C3.45156 15.4486 2.27187 15.3673 1.87969 14.6892C1.49375 14.022 2.00781 12.9595 1.80469 12.197C1.60781 11.4595 0.625 10.8001 0.625 10.0001C0.625 9.20012 1.60781 8.54075 1.80469 7.80325C2.00781 7.04075 1.49375 5.97825 1.87969 5.31106C2.27187 4.63293 3.45156 4.55168 4.00156 4.00168C4.55156 3.45168 4.63281 2.272 5.31094 1.87981C5.97813 1.49387 7.04062 2.00793 7.80312 1.80481C8.54062 1.60793 9.2 0.625122 10 0.625122C10.8 0.625122 11.4594 1.60793 12.1969 1.80481C12.9594 2.00793 14.0219 1.49387 14.6891 1.87981C15.3672 2.272 15.4484 3.45168 15.9984 4.00168C16.5484 4.55168 17.7281 4.63293 18.1203 5.31106C18.5063 5.97825 17.9922 7.04075 18.1953 7.80325C18.3922 8.54075 19.375 9.20012 19.375 10.0001Z" fill="#2568EF"/> <path d="M12.7094 7.20637L9.14062 10.7751L7.29062 8.92669C6.88906 8.52512 6.23749 8.52512 5.83593 8.92669C5.43437 9.32825 5.43437 9.97981 5.83593 10.3814L8.43124 12.9767C8.82187 13.3673 9.45624 13.3673 9.84687 12.9767L14.1625 8.66106C14.5641 8.2595 14.5641 7.60794 14.1625 7.20637C13.7609 6.80481 13.1109 6.80481 12.7094 7.20637Z" fill="#FFFCEE"/> </g> <defs> <clipPath id="clip0_11_215"> <rect width="20" height="20" fill="white"/> </clipPath> </defs> </svg>';
		} else {
			return "";
		}
	}

	function postDate(video) {
		function convertTime(seconds) {
			const totalMinutes = Math.floor(seconds / 60);
			const hours = Math.floor(totalMinutes / 60);
			const minutes = totalMinutes % 60;
			return `${hours}hrs ${minutes} min ago`;
		}
		if (video.others?.posted_date) {
			return `
				<p class="absolute bottom-3 right-3 bg-[#171717] text-white text-xs p-1 rounded-md">
					${convertTime(video.others.posted_date)}
				</p>
			`
		} else {
			return "";
		}
	}

	videos.forEach(video => {
		const videoCard = document.createElement('div');
		videoCard.classList = `card shadow hover:shadow-xl transition`;
		videoCard.innerHTML = `
			<figure class="h-full lg:h-48 relative">
				<img class="h-full w-full" src="${video.thumbnail}" alt=""/>
				${postDate(video)}
			</figure>
			<div class="card-body p-6">
				<div class="flex gap-3">
					<img class="w-10 h-10 rounded-full object-cover" src="${video.authors[0].profile_picture}" alt="">
					<div>
						<h2 class="card-title font-bold">${video.title}</h2>
						<p class="text-[#171717B2] my-2">${video.authors[0].profile_name} ${isVerified(video)}</p>
						<p class="text-[#171717B2] leading-5">${video.others?.views} views</p>
					</div>
				</div>
			</div>
		`
		videoContainer.classList = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5";
		videoContainer.appendChild(videoCard);
	});
}

function sortByView() {
	videos.sort(function (p1, p2) {
		let views1 = p1.others.views.slice(0, -1);
		views1 = parseFloat(views1);
		let views2 = p2.others.views.slice(0, -1);
		views2 = parseFloat(views2);
		return (views1 < views2) ? 1 : (views1 > views2) ? -1 : 0
	});
	displayVideos(videos);
}

loadFirstCategory();
getCategoryCode();
