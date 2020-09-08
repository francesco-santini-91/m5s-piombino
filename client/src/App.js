import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';
import Register from './components/register/register';
import ForgotPassword from './components/login/forgotPassword';
import RestorePassword from './components/login/restorePassword';
import Confirm from './components/confirm/confirm';
import PostsContainer from './components/postsContainer/postsContainer';
import EventsContainer from './components/eventsContainer/eventsContainer';
import PollsContainer from './components/pollsContainer/pollsContainer';
import PostDetail from './components/postDetail/postDetail';
import EventDetail from './components/eventDetail/eventDetail';
import PollDetail from './components/pollDetail/pollDetail';
import ProtectedRoute from './components/protectedRoutes/protectedRoutes';
import ProtectedAdminRoute from './components/protectedAdminRoutes/protectedAdminRoutes';
import ProtectedSuperUserRoute from './components/protectedSuperUserRoutes/protectedSuperUserRoutes';
import Profile from './components/profile/profile';
import AdminPanel from './components/adminPanel/adminPanel';
import HomepageTabs from './components/admin/homepageTabs';
import NewPost from './components/admin/newPost';
import NewEvent from './components/admin/newEvent';
import NewPoll from './components/admin/newPoll';
import AllPosts from './components/admin/allPosts';
import AllEvents from './components/admin/allEvents';
import AllPolls from './components/admin/allPolls';
import AllUsers from './components/admin/allUsers';
import EditUser from './components/admin/editUser';
import SuperUserPanel from './components/superUserPanel/superUserPanel';
import Footer from './components/footer/footer';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/resetPassword" component={ForgotPassword}></Route>
          <Route exact path="/restorePassword/:username" component={RestorePassword}></Route>
          <Route exact path="/confirm/:username" component={Confirm}></Route>
          <Route exact path="/posts" component={PostsContainer}></Route>
          <Route exact path="/events" component={EventsContainer}></Route>
          <Route exact path="/polls" component={PollsContainer}></Route>
          <Route exact path="/events/:eventID" component={EventDetail}></Route>
          <Route exact path="/posts/:urlTitle" component={PostDetail}></Route>
          <Route exact path="/polls/:pollID" component={PollDetail}></Route>
          <ProtectedRoute exact path="/profile" component={Profile}></ProtectedRoute>
          <ProtectedAdminRoute exact path="/admin" component={AdminPanel}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/homepageTabs" component={HomepageTabs}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/allPosts" component={AllPosts}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/allEvents" component={AllEvents}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/allPolls" component={AllPolls}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/newPost" component={NewPost}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/newEvent" component={NewEvent}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/newPoll" component={NewPoll}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/usersList" component={AllUsers}></ProtectedAdminRoute>
          <ProtectedAdminRoute exact path="/admin/users/:userID" component={EditUser}></ProtectedAdminRoute>
          <ProtectedSuperUserRoute exact path="/superUser" component={SuperUserPanel}></ProtectedSuperUserRoute>
        </Switch>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
