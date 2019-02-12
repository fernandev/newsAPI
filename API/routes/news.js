const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		count: 1,
		links: {
			next: null,
			previous: null,
			self: 'http://localhost:8000/news'
		},
		results: [
			{
				author: 'This is a made-up author name',
				title: 'This is a made-up title',
				content: 'This is a minimalistic description',
				created_at: '8 min ago',
				image_url: 'This is a made-up url',
				likes: 8
			}
		]
	});
});

module.exports = router;
