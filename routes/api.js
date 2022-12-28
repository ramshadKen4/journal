var express = require('express');
var router = express.Router();
var contentHelper = require('../helpers/content_helpers');
var setTime = function(element) {
  var date = new Date()
  let minutes = Math.trunc((date - element.date) / 60000);
  element.date = minutes + " minutes";
  if (minutes > 60) {
    let hours = Math.trunc(minutes / 60);
    element.date = hours + " hours";
    if (hours > 24) {
      let days = Math.trunc(hours / 60);
      element.date = days + " days"
    }
  }
}
router.get('/', function (req, res, next) {
  contentHelper.getAllContents().then((content) => {
    content.forEach(setTime)
    res.json(content);
  })
});

router.get('/view', (req, res) => {
  try {
    contentHelper.getContent(req.query.id).then((content) => {
      res.json(content)
    })
  } catch {
    res.json(`didn't get any data`);
  }
})

router.post('/add', (req, res) => {
  let title = req.body.title;
  let color = req.body.color;
  let content = req.body.content;
  console.log(req.body)
  if (title && content) {
    contentHelper.addContent({ title, content, color }).then((response) => {
      let insertedId = response.insertedId.toString()
      res.json("data uploaded successfully")
      if (req.files) {
        let image = req.files.image;
        image.mv('./public/images/content/' + insertedId + '.jpg', (err) => {
          if (err) {
            console.log(err);
          }
          console.log("image uploaded");
        })
      }
    })

  } else {
    res.json('did not get any of data');
  }
});

router.delete('/delete/',(req, res) => {
  contentId = req.query.id;
  contentHelper.deleteContent(contentId).then((response) => {
    res.json(response);
  })
})

router.put('/edit',(req,res)=>{
  let data={
    id:req.query.id
  };
  data.title = req.body.title;
  data.content = req.body.content;
  data.color = req.body.color;
  console.log(data);
  contentHelper.updateContent(data).then((response)=>{
    res.json("data updated")
  })
})
module.exports = router;