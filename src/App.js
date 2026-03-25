import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Thêm dòng này
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Author from './components/Author/Author';
import CreateAuthor from './components/Author/CreateAuthor';
import UpdateAuthor from './components/Author/UpdateAuthor';
import Book from './components/Book/Book';
import CreateBook from './components/Book/CreateBook';
import UpdateBook from './components/Book/UpdateBook';
import './App.css';
import Navigation from './components/Navigation';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='*' element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/author" element={<Author />} />
                  <Route path="/author/create" element={<CreateAuthor />} />
                  <Route path="/author/update" element={<UpdateAuthor />} />
                  <Route path="/book" element={<Book />} />
                  <Route path="/book/create" element={<CreateBook />} />
                  <Route path="/book/update" element={<UpdateBook />} />
                </Routes>
              </>
            }>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;