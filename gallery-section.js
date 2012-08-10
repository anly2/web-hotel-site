gallery = new Object();

// Animation parameters
// parameters are MANDATORY and must be defined
gallery.param = new Object();
gallery.param.image    = {width: 954};
gallery.param.trample  = {width: 160};
gallery.param.duration = {'stretch': 500,      'slide': 750,     'trample': 1000};
gallery.param.easing   = {'stretch': 'linear', 'slide': 'linear', 'trample': 'swing'};
gallery.param.stable   = true;

// Private variables
// DO NOT EDIT!
gallery.tabs   = null;
gallery.imgs   = null;
gallery.active = null; //The currently focused picture as (int)index
gallery.state  = 0;    //The animation state: 0 - settled , 1 - stretched , 2 - sliding
gallery.offset = 0;    //The number of intermediate pictures to be shifted

gallery.previous = function(){
   //Stretch
   if(this.state < 1){
      $(this.imgs[this.active]).animate( {'margin-left': 0, 'margin-right': 0}, {'duration': this.param.duration.stretch, 'easing': this.param.easing.stretch, 'complete': function(){gallery.state=1; gallery.previous();} } );

      if(this.param.stable)
         $(this.imgs[0].parentNode).animate( {'margin-left': '-='+this.param.trample.width}, {'duration': this.param.duration.stretch, 'easing': this.param.easing.stretch} );

      return true;
   }

   //Move left
   if(this.offset >= 0){
      this.state = 2;
      $(this.imgs[0].parentNode).animate( {'margin-left': '+='+this.param.image.width}, {'duration': this.param.duration.slide, 'easing': this.param.easing.slide, 'complete': function(){$(gallery.tabs[gallery.active]).removeClass('active'); gallery.active--;  $(gallery.imgs[gallery.active]).addClass('active'); $(gallery.tabs[gallery.active]).addClass('active'); gallery.showTab(gallery.active); gallery.previous();}} );

      $(this.imgs[this.active]).removeClass('active');

      this.offset--;
      return true;
   }

   //Trample
   if(this.offset < 0){
      $(this.imgs[this.active]).animate( {'margin-left': -this.param.trample.width, 'margin-right': -this.param.trample.width}, {'duration': this.param.duration.trample, 'easing': this.param.easing.trample, 'complete': function(){gallery.state = 0;} } );

      if(this.param.stable)
         $(this.imgs[0].parentNode).animate( {'margin-left': '+='+this.param.trample.width}, {'duration': this.param.duration.trample, 'easing': this.param.easing.trample} );

      return true;
   }
}

gallery.next = function(){
   //Stretch
   if(this.state < 1){
      $(this.imgs[this.active]).animate( {'margin-left': 0, 'margin-right': 0}, {'duration': this.param.duration.stretch, 'easing': this.param.easing.stretch, 'complete': function(){gallery.state=1; gallery.next();} } );

      if(this.param.stable)
         $(this.imgs[0].parentNode).animate( {'margin-left': '-='+this.param.trample.width}, {'duration': this.param.duration.stretch, 'easing': this.param.easing.stretch} );

      return true;
   }

   //Move left
   if(this.offset >= 0){
      this.state = 2;
      $(this.imgs[0].parentNode).animate( {'margin-left': '-='+this.param.image.width}, {'duration': this.param.duration.slide, 'easing': this.param.easing.slide, 'complete': function(){$(gallery.tabs[gallery.active]).removeClass('active'); gallery.active++; $(gallery.imgs[gallery.active]).addClass('active'); $(gallery.tabs[gallery.active]).addClass('active'); gallery.showTab(gallery.active); gallery.next();}} );

      $(this.imgs[this.active]).removeClass('active');

      this.offset--;
      return true;
   }

   //Trample
   if(this.offset < 0){
      $(this.imgs[this.active]).animate( {'margin-left': -this.param.trample.width, 'margin-right': -this.param.trample.width}, {'duration': this.param.duration.trample, 'easing': this.param.easing.trample, 'complete': function(){gallery.state = 0;} } );

      if(this.param.stable)
         $(this.imgs[0].parentNode).animate( {'margin-left': '+='+this.param.trample.width}, {'duration': this.param.duration.trample, 'easing': this.param.easing.trample} );

      return true;
   }
}
gallery.showTab = function(i){
   this.hideTabs();
   var t = $('.tab-content.tab'+i);
   t.addClass('active');
}
gallery.hideTabs = function(){
   $('.tab-content.active').removeClass('active');
}

gallery.show = function(i){
      //Initial Preperations
      if(!this.imgs){
         this.imgs = $('.gallery .image-container img');

         var tabs = $('.gallery .tabs');
         $.each(this.imgs,
            function(i,val){
               tabs.append('<span class="tab" onclick="gallery.show('+i+');"></span>');
            }
         );
      }
      if(!this.tabs){
         this.tabs = $('.gallery .tabs .tab');
      }

   // If already in motion
   if(this.state > 0)
      return false;

   // Slide to the left
   if(this.active > i){
      this.offset = (this.active - i)-1;
      this.previous();
   }else
   // Slide to the right
   if(this.active < i){
      this.offset = (i - this.active)-1;
      this.next();
   }else{
   // Handle the first focusing
      this.active = i;

      $(this.imgs[this.active]).css({'margin-left': -this.param.trample.width, 'margin-right': -this.param.trample.width});

      $(this.imgs[this.active]).addClass('active');
      $(this.tabs[this.active]).addClass('active');
      this.showTab(this.active);
   }

}