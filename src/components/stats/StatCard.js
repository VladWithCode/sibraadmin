import React from 'react';
import Card from '../ui/Card';
import CardBody from '../ui/CardBody';
import CardHeader from '../ui/CardHeader';
import List from '../ui/List';
import ListItem from '../ui/ListItem';

function StatCard({ title, stats }) {
  return (
    <Card classList={['Stats-card']}>
      <CardHeader
        classList={['Stats-card__header']}
        content={title}></CardHeader>
      <CardBody classList={['Stats-card__body']}>
        <div className='Stats-card__section'>
          <List>
            {stats?.map(stat => {
              return (
                <ListItem>
                  <span className='stat-name'>{stat.name}</span>
                  <span className='stat-value'>{stat.value}</span>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className='Stats-card__section'>
          <List>
            {stats?.map(stat => {
              return (
                <ListItem>
                  <span className='stat-name'>{stat.name}</span>
                  <span className='stat-value'>{stat.value}</span>
                </ListItem>
              );
            })}
          </List>
        </div>
      </CardBody>
    </Card>
  );
}

export default StatCard;
