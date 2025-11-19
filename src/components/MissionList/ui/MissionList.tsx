import type { MissionListProps } from '../model/types'

export const MissionList = ({ missions, userProfile, getMissionPriority }: MissionListProps) => {
  return (
    <div className="mission-checklist">
      {missions.map((mission) => {
        const priority = getMissionPriority(mission, userProfile)
        const isRecommended = priority > 0
        return (
          <div key={mission.id} className={`mission-item ${isRecommended ? 'mission-recommended' : ''}`}>
            <input type="checkbox" id={`mission${mission.id}`} className="mission-checkbox" />
            <label htmlFor={`mission${mission.id}`} className="mission-label">
              {isRecommended && (
                <span className="mission-priority-badge" title="프로필 기반 추천">
                  ⭐
                </span>
              )}
              <span className="mission-text">{mission.title}</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}

