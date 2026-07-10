// 임시 컴포넌트 데모 — 라우터 붙으면 교체 예정
import { useState } from 'react'
import Chip from './components/common/Chip'
import Button from './components/common/Button'
import Input from './components/common/Input'
import CheckPoint from './components/common/CheckPoint'
import Toggle from './components/common/Toggle'
import TabBar from './components/common/TabBar'
import ListItem from './components/common/ListItem'
import DateCell from './components/common/DateCell'
import Header from './components/layout/Header'

function App() {
  const [period, setPeriod] = useState('월')
  const [tab, setTab] = useState('할 일')
  const [done, setDone] = useState(false)
  const [selectedDay, setSelectedDay] = useState(10)

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-4">
      <Header title="LabelText" onPrev={() => {}} onNext={() => {}} />

      <section className="flex flex-wrap gap-2">
        <Chip label="공부" />
        <Chip label="운동" color="green" />
        <Chip label="약속" color="pink" />
        <Chip label="공부" color="yellow" />
        <Chip label="공부" color="purple" />
        <Chip label="공부" color="cyan" />
        <Chip label="공부" color="apricot" />
      </section>

      <section className="flex flex-col gap-2">
        <Input placeholder="InputText" />
        <Input defaultValue="InputText" />
        <Input defaultValue="InputText" error />
        <div className="flex gap-3">
          <CheckPoint text="사용 가능한 아이디예요" />
          <CheckPoint text="이미 있는 아이디예요" valid={false} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Button>ButtonText</Button>
        <Button disabled>ButtonText</Button>
      </section>

      <section className="flex items-center gap-4">
        <Toggle options={['월', '주']} value={period} onChange={setPeriod} />
        <Toggle
          options={['분야별', '우선순위']}
          value="분야별"
          onChange={() => {}}
        />
      </section>

      <section className="flex gap-1">
        {[8, 9, 10, 11, 12].map((day) => (
          <DateCell
            key={day}
            day={day}
            weekday={['일', '월', '화', '수', '목'][day - 8]}
            selected={day === selectedDay}
            count={day === 10 ? 3 : undefined}
            onClick={() => setSelectedDay(day)}
          />
        ))}
      </section>

      <TabBar tabs={['할 일', '통계']} active={tab} onChange={setTab} />

      <section className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3">
        <ListItem
          label="알고리즘 문제 풀기"
          chipLabel="공부"
          checked={done}
          onToggle={() => setDone(!done)}
        />
        <ListItem label="러닝 5km" chipLabel="운동" chipColor="green" />
      </section>
    </div>
  )
}

export default App
