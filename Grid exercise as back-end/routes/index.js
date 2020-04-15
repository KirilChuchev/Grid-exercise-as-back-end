// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router();
const fs = require('fs');
const path = require('path');
const dataFilePath = path.resolve(__dirname, '../public/js/MOCK_DATA.js');


router.get('/', (req, res) => {
	res.render('index', {text: 'This is the dynamic data. Open index.js from the routes directory to see.'})
})



function readFile(dataFilePath){

	return allData = fs.readFileSync(dataFilePath, {encoding: 'utf-8'});
}

function writeFile(dataFilePath, data){

	return fs.writeFileSync(dataFilePath, JSON.stringify(data));
}

router.get('/all', (req, res) => {

	let allData = JSON.parse(readFile(dataFilePath));

	res.json(allData);
})

router.get('/delete/:id', (req, res) => {

	let id = +req.params.id;

	let allData = JSON.parse(readFile(dataFilePath));

	allData = allData.filter(x => x.id !== id);

	writeFile(dataFilePath, allData)

	res.json(allData)
});


router.get('/sort/:criteria', (req, res) => {

	let criteria = req.params.criteria;

	let allData = JSON.parse(readFile(dataFilePath));

	const sortOptions = {
		identification: (data) => data.sort((a, b) => Number(a['id']) - (Number(b['id']))),
		firstName: (data) => data.sort((a, b) => a['first_name'].localeCompare(b['first_name'])),
		lastName: (data) => data.sort((a, b) => a['last_name'].localeCompare(b['last_name'])),
		email: (data) => data.sort((a, b) => a['email'].localeCompare(b['email'])),
		position: (data) => data.sort((a, b) => a['job_title'].localeCompare(b['job_title'])),
		department: (data) => data.sort((a, b) => a['department'].localeCompare(b['department'])),
	}

	allData = sortOptions[criteria](allData);
	
	res.json(allData);

	writeFile(dataFilePath, allData)
});

let isFiltered = '';

router.get('/filter/:criteria', (req, res) => {

	let criteria = req.params.criteria;

	let allData = JSON.parse(readFile(dataFilePath));

	if (isFiltered) {
		res.json(allData);
		isFiltered = false;
		return;
	}
	
	filteredData = allData.filter(x => x.department === criteria);

	isFiltered = true;

	res.json(filteredData);
	
})


module.exports = router
