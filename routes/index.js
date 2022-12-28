var express = require('express');
var router = express.Router();
var contentHelper = require('../helpers/content_helpers');
/* GET home page. */
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
    res.render('index', { content });
  })
});

router.get('/add', (req, res) => {
  res.render('add_form');
})

router.post('/add', (req, res) => {
  let title = req.body.title;
  let color = req.body.color;
  let content = req.body.content;
  console.log(req.body)
  if (title && content) {
    contentHelper.addContent({ title, content, color }).then((response) => {
      let insertedId = response.insertedId.toString()
      res.redirect('/')
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
    res.render('add_form');
  }
});

router.get('/delete/:id', (req, res) => {
  contentId = req.params.id;
  contentHelper.deleteContent(contentId).then((response) => {
    res.redirect('/');
  })
})

router.get('/view/:id', (req, res) => {
  try {
    contentHelper.getContent(req.params.id).then((content) => {
      res.render("content", { content })
    })
  } catch {
    res.redirect('/');
  }
})

router.get('/edit/:id', (req, res) => {
  let contentId = req.params.id;
  contentHelper.getContent(contentId).then((content) => {
    res.render("edit_form", { content })
  })
});

router.post('/edit',(req,res)=>{
  let data={
    id:req.body.id
  };
  data.title = req.body.title;
  data.content = req.body.content;
  data.color = req.body.color;
  console.log(data);
  contentHelper.updateContent(data).then((response)=>{
    console.log(response)
    res.redirect('/');
  })
})
module.exports = router;