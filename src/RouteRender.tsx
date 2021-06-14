import { Route, Switch } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import { CourseByMajor } from './component/courses/CourseByMajor';
import { HomePage } from './page/HomePage';

import { ErrorLoginPage } from './page/common/ErrorLoginPage';
import { ClassComponent } from './component/classes/ClassesComponent';
import { EditDetailTeacher } from './component/teachers/EditDetailTeacher';
import { CourseByClass } from './component/courses/CourseByClass';
import { DetailStudent } from './component/students/DetailStudent';
import { NewStudent } from './component/students/NewStudent';
import { NewTeacher } from './component/teachers/NewTeacher';
import { NewClass } from './component/classes/NewClass';
import { EditDetailStudent } from './component/students/EditDetailStudent';
import { TeacherComponent } from './component/teachers/TeacherComponent';
import { StudentComponent } from './component/students/StudentComponent';
import { Login } from './component/account/Login';
import { RegisterClass } from './component/classes/RegisterClass';
import { DetailTeacher } from './component/teachers/DetailTeacher';
import ProtectedRoute from './component/authentication/ProtectedRoute';

/**
 * RouteRender

 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNT9           Create
 */
function RouteRender() {
  return (
    <div
      style={{
        width: "98.6%",
      }}
    >
      <Switch>
        <Route path="/" component={Login} exact />
        <Route path="/students" component={StudentComponent} exact />
        <Route path="/teachers" component={TeacherComponent} exact />
        <Route path="/courses" ><CourseByMajor /> </Route>
        <Route path="/classes" component={ClassComponent} exact />

        <Route path="/detailstudent/:name" component={DetailStudent} exact />
        <Route path="/detailteacher/:name" component={DetailTeacher} exact />
        <Route path="/addnewstudent" component={NewStudent} exact />
        <Route path="/addnewteacher" component={NewTeacher} />
        <Route path="/addnewClass" component={NewClass} />

        <Route path="/editstudent/:studentId" component={EditDetailStudent} exact />
        <ProtectedRoute path="/editTeacher/:teacherId" component={EditDetailTeacher} exact />
        <Route path="/registerClass/:name" component={RegisterClass} exact />
        <Route path="/coursebyclass/:classname" component={CourseByClass} exact />

        <Route path="/HomePage" component={HomePage} exact />
        <Route path="/ErrorPage" component={ErrorLoginPage} />

        <Route path="/" > <HomePage /> </Route>
      </Switch>
    </div>
  );
}

export default RouteRender;
