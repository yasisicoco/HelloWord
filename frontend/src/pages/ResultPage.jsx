import './SelectKids.sass';
import { FaCirclePlus } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildModal from '../components/ChildModal';
import UserAPI from '../api/UserAPI';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedKid } from '../features/Auth/kidSlice'; // 아이 선택 액션

const ResultPage = () => {};

export default ResultPage;
