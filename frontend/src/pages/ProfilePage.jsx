import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import PageWrapper from '../components/layout/PageWrapper'
import ProfileForm from '../components/profile/ProfileForm'
import ProfileCompletionCard from '../components/ui/ProfileCompletionCard'
import GovCard from '../components/ui/GovCard'
import { getProfile, updateProfile } from '../services/profile'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setFetchLoading(false))
  }, [])

  async function handleSave(data) {
    setLoading(true)
    setError('')
    try {
      await updateProfile(data)
      toast.success('Profile saved!')
      navigate('/recommendations')
    } catch (err) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return (
    <PageWrapper>
      <div className="flex justify-center py-20">
        <div className="spinner w-8 h-8" />
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center">
              <User size={20} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Your Profile</h1>
              <p className="text-gov-muted text-sm">Complete your details for accurate scheme recommendations</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <ProfileCompletionCard profile={profile} />
        </div>

        <GovCard className="p-6">
          <ProfileForm
            initialValues={profile || {}}
            onSubmit={handleSave}
            loading={loading}
            error={error}
          />
        </GovCard>
      </div>
    </PageWrapper>
  )
}
