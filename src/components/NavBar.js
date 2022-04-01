import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const NavBar = () => {
  const [navExpanded, setNavExpanded] = useState(false);

  const handleExpand = () => {
    setNavExpanded(!navExpanded);

    !navExpanded
      ? document.querySelector('.app').classList.add('minimize')
      : document.querySelector('.app').classList.remove('minimize');
  };

  const {
    auth: { isAuth, role },
    redirect: { projects, clients, history, templates },
  } = useSelector(state => state);

  return (
    <nav className={navExpanded ? 'expand' : ''}>
      <div className='icons-container'>
        <NavLink
          to={`${projects ? projects : '/proyectos'}`}
          activeClassName='active'
          className='link'>
          <svg>
            <use href='../assets/svg/home.svg#home'></use>
          </svg>
          <span>Proyectos</span>
        </NavLink>
        <NavLink
          to={`${clients ? clients : '/clientes'}`}
          activeClassName='active'
          className='link'>
          <svg>
            <use href='../assets/svg/users.svg#users'></use>
          </svg>
          <span>Clientes</span>
        </NavLink>
        <NavLink
          to={`${history ? history : '/historial'}`}
          activeClassName='active'
          className='link'>
          <svg>
            <use href='../assets/svg/calendar.svg#calendar'></use>
          </svg>
          <span>Hitorial</span>
        </NavLink>
        <NavLink
          to={`${templates ? templates : '/plantillas'}`}
          activeClassName='active'
          className='link'>
          <svg>
            <use href='../assets/svg/file.svg#file'></use>
          </svg>
          <span>Plantillas</span>
        </NavLink>
        {isAuth && (role === 'ADMIN' || role === 'DEV') && (
          <NavLink to={'/stats'} activeClassName='active' className='link'>
            <svg>
              <use href='../assets/svg/stats.svg#stats'></use>
            </svg>
            <span>Estadisticas</span>
          </NavLink>
        )}
        <NavLink
          to={isAuth ? '/usuario' : '/iniciar'}
          activeClassName='active'
          className='link bot'>
          <svg>
            <use href='../assets/svg/user.svg#user'></use>
          </svg>
          <span>{isAuth ? 'Ver Perfil' : 'Iniciar Sesion'}</span>
        </NavLink>

        {/* <NavLink to="/ajustes" activeClassName="active" className="link settings">
                    <svg><use href="/../assets/svg/cog.svg#cog" ></use></svg>
                    <span>Ajustes</span>
                </NavLink> */}
      </div>
      <div onClick={handleExpand} className='expand-btn'>
        <svg>
          <use href='../assets/svg/down.svg#down'></use>
        </svg>
      </div>
    </nav>
  );
};
