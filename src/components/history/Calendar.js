import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "moment/locale/es-mx";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { messages } from '../../helpers/calendarSetup';
import { CalendarEvent } from './CalendarEvent';
import { useSelector } from 'react-redux';
import { LateRecords } from './LateRecords';

moment.locale('es-mx');

const localizer = momentLocalizer(moment) // or globalizeLocalizer

export const CalendarComponent = () => {

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    const { records } = useSelector(state => state);

    const [events, setEvents] = useState([]);

    const [late, setLate] = useState([]);

    useEffect(() => {

        const lateRecords = [];

        setEvents(
            records.map((record) => {
                if (record.state === 'reserved' || record.state === 'prereserved') {

                    const eventdate = moment(record.paymentInfo.hasProrogation ? record.paymentInfo.prorogatedTo : record.paymentInfo.nextPaymentDate).toDate()

                    if (record.paymentInfo.isLate) {
                        lateRecords.push(record)
                    }

                    return ({
                        lotId: record.lot,
                        projectId: record.project,
                        title: record.customer.fullName,
                        start: eventdate,
                        end: eventdate,
                        bgcolor: '#fafafa',
                        isLate: record.paymentInfo.isLate,
                        hasProrogation: record.paymentInfo.hasProrogation,
                        allDay: true,
                        phoneNumber: record.customer.phoneNumber,
                        event: 'Pago del lote'
                    })
                }
                return null
            })
        )

        setLate(lateRecords);

    }, [records])

    const eventStyleGetter = ({ event, isLate, hasProrogation, isSelected }) => {

        const style = {
            backgroundColor: isLate ? 'tomato' : hasProrogation ? '#FF9800' : '#448AFF',
            color: 'white'
        }

        return { style }
    }

    const onDoubleClick = e => {
        console.log(e);
    }

    const onSelectEvent = ({ lotId, projectId }) => {
        console.log('holi');
    }



    const onViewChanged = e => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }



    return (

        <div className="app-screen projects-screen">

            <div className="app-screen__title projects-screen-top">
                <h1 className="app-screen__title" >Calendario de Pagos</h1>
            </div>
            <div className="history project">
                <div className="card calendar">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        messages={messages}
                        eventPropGetter={eventStyleGetter}
                        onDoubleClickEvent={onDoubleClick}
                        onSelectEvent={onSelectEvent}
                        onView={onViewChanged}
                        view={lastView}
                        components={{
                            event: CalendarEvent
                        }}
                    />
                </div>



                {
                    late.length > 0 && (
                        <>
                            <div className="project__header">
                                <h3>Pagos retrasados</h3>
                            </div>
                            <LateRecords lateRecords={late} />
                        </>
                    )
                }

            </div>
        </div>

    )
}
