
<?php include '_html-head.php'; ?>

	<main class="container-fluid">
		<div class="row">
			<?php include 'sidebar.php'; ?>

			<div class="contentPush col-md-12 col-sm-12 col-xs-12">
				<div class="row">
					<div class="col-xs-12 dropdown--wrap">
						<select class="dropdown">
							<option value="world">World edition</option>
							<option value="uk">UK edition</option>
							<option value="us">US edition</option>
						</select>
						<select class="dropdown">
							<option value="world">List view</option>
							<option value="uk">Grid view</option>
						</select>
					</div>

					<div class="articleList col-lg-9 col-xs-12">

						<h2 class="articleList__sectionHeadline">Edit profile</h2>

						<div class="articleList__listSection articleList__listSection--listView">
							<article class="articleList__item">
								<a href="#">
									<figure class="articleList__image">
										<img src="../public/img/article_img/user_avatar.png">
									</figure>
									<div class="articleList__info">
										<h3 class="articleList__headline">Ljuba Rankovic</h3>
										<p class="articleList__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pellentesque odio mauris, nec malesuada lacus porta non. Maecenas et neque venenatis, tempus sem id, venenatis dui. Sed laoreet ex nunc, nec tincidun.</p>
										<div class="articleList__metadata">
											<span class="articleList__metadata__item">User since: 5th January 2017</span>
										</div>
									</div>
								</a>
							</article>
						</div>



						







<div class="tabs">
	<ul class="nav nav-tabs">
	  <li class="active"><a data-toggle="tab" href="#home">Home</a></li>
	  <li><a data-toggle="tab" href="#menu1">Menu 1</a></li>
	  <li><a data-toggle="tab" href="#menu2">Menu 2</a></li>
	</ul>

	<div class="tab-content">
	  <div id="home" class="tab-pane fade in active">
		<form>
			<div class="twoColumns">
			  <div class="twoColumns__item">
			  	<div class="form-group">
				    <label for="exampleInputEmail1">First name</label>
				    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Ljuba">
			  	</div>
			  <div class="form-group">
				    <label for="exampleInputEmail1">Last name</label>
				    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Rankovic">
				  </div>
				  <div class="form-group">
				    <label for="exampleInputPassword1">Password</label>
				    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
				  </div>
					<div class="form-group">
				    <label for="exampleInputEmail1">About</label>
				    <textarea class="form-control" rows="4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pellentesque odio mauris, nec malesuada lacus porta non. Maecenas et neque venenatis, tempus sem id, venenatis dui. Sed laoreet ex nunc, nec tincidun.</textarea>
				  </div>
				  <div class="form-group">
				    <label for="exampleInputFile">Image profile</label>
				    <input type="file" id="exampleInputFile">
				    <p class="help-block">Example block-level help text here.</p>
				  </div>
			  </div>

			  <div class="twoColumns__item">
			  	<div class="checkbox">
				    <label>
				      <input type="checkbox"> Check me out
				    </label>
			  	</div>
			  	<div class="checkbox">
				    <label>
				      <input type="checkbox"> Check me out
				    </label>
			  	</div>
			  	<div class="checkbox">
				    <label>
				      <input type="checkbox"> Check me out
				    </label>
			  	</div>
			  	<div class="checkbox">
				    <label>
				      <input type="checkbox"> Check me out
				    </label>
			  	</div>

	    		<p class="help-block">Example block-level help text here.</p>


			  </div>
		  </div>
		  <button type="submit" class="button btn btn-default">Submit</button>
		  <button type="submit" class="button button--grey btn btn-default">Cancel</button>
		</form>
	  </div>
	  <div id="menu1" class="tab-pane fade">
	    <p>Some content in menu 1.</p>
	  </div>
	  <div id="menu2" class="tab-pane fade">
	    <p>Some content in menu 2.</p>
	  </div>
	</div>
</div>



























					</div>

					<div class="boxSidebar col-lg-3 col-xs-12">
						<div class="boxSidebar__item boxSidebar__weatherWidget" style="background-image: url(../public/img/article_img/belgrade.png);">
							<span class="boxSidebar__temperature">20°</span>
							<p class="boxSidebar__city">Belgrade</p>
							<p class="boxSidebar__desc">Sunny</p>
						</div>

						<div class="boxSidebar__item boxSidebar__mostRead">
							<h2 class="boxSidebar__item__headline">Most read</h2>
							<ul>
								<li class="boxSidebar__mostReadItem"><a href="#">Automated Client-server Emulation</a></li>
								<li class="boxSidebar__mostReadItem"><a href="#">Switchable Demand-driven Processimprovement</a></li>
								<li class="boxSidebar__mostReadItem"><a href="#">Automated Client-server Emulation</a></li>
								<li class="boxSidebar__mostReadItem"><a href="#">Phased Analyzing Conglomeration</a></li>
								<li class="boxSidebar__mostReadItem"><a href="#">Managed Dedicated Strategy</a></li>
							</ul>
						</div>

						<div class="boxSidebar__item boxSidebar__editorsPicks">
							<h2 class="boxSidebar__item__headline">Editors' picks</h2>
							<ul>
								<li class="boxSidebar__editorsPicksItem">
									<a href="#"><span class="boxSidebar__editorsPicks__headline">Automated Client-server Emulation</span> 
									<span class="boxSidebar__editorsPicks__info">The Guardian</span> 
									<span class="boxSidebar__editorsPicks__info">40 min ago</span></a>
								</li>

								<li class="boxSidebar__editorsPicksItem">
									<a href="#"><span class="boxSidebar__editorsPicks__headline">Switchable Demand-driven Processimprovement</span> 
									<span class="boxSidebar__editorsPicks__info">The Guardian</span> 
									<span class="boxSidebar__editorsPicks__info">40 min ago</span></a>
								</li>

								<li class="boxSidebar__editorsPicksItem">
									<a href="#"><span class="boxSidebar__editorsPicks__headline">Automated Client-server Emulation</span> 
									<span class="boxSidebar__editorsPicks__info">The Guardian</span> 
									<span class="boxSidebar__editorsPicks__info">40 min ago</span></a>
								</li>

								<li class="boxSidebar__editorsPicksItem">
									<a href="#"><span class="boxSidebar__editorsPicks__headline">Phased Analyzing Conglomeration</span> 
									<span class="boxSidebar__editorsPicks__info">The Guardian</span> 
									<span class="boxSidebar__editorsPicks__info">40 min ago</span></a>
								</li>

								<li class="boxSidebar__editorsPicksItem">
									<a href="#"><span class="boxSidebar__editorsPicks__headline">Managed Dedicated Strategy</span> 
									<span class="boxSidebar__editorsPicks__info">The Guardian</span> 
									<span class="boxSidebar__editorsPicks__info">40 min ago</span></a>
								</li>
								
							</ul>
						</div>
					</div>

				</div>

			</div>
			
		</div>
	</main>


<?php include 'footer.php'; ?>
<?php include '_html-foot.php'; ?>