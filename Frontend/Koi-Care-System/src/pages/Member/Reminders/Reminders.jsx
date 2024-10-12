import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import '../../../index.css'
import { ScheduleComponent, Day, Week, WorkWeek, Agenda, Month, Inject } from '@syncfusion/ej2-react-schedule'

function Reminders() {
  const { isDarkMode } = useDarkMode()

  const data = [
    {
      Id: 2,
      Subject: 'Meeting',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 15, 12, 30),
      IsAllDay: false,
      Status: 'Completed',
      Priority: 'High'
    }
  ]
  const fieldsData = {
    id: 'Id',
    subject: { name: 'Subject' },
    isAllDay: { name: 'IsAllDay' },
    startTime: { name: 'StartTime' },
    endTime: { name: 'EndTime' }
  }
  const eventSettings = { dataSource: data, fields: fieldsData }

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />

          <div className='py-5 px-[30px] mx-auto max-h-[800px]'>
            <TopLayout text='Reminders' links='/member/reminders' />

            <ScheduleComponent
              height='625px'
              width='100%'
              selectedDate={new Date(2018, 1, 15)}
              eventSettings={eventSettings}
              className='rounded-lg border border-gray-200 '
            >
              <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reminders
