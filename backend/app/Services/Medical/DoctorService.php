<?php
namespace App\Services\Medical;

use App\Repositories\Medical\DoctorProfileRepository;
use App\Models\DoctorProfile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

class DoctorService
{
    public function __construct(
        protected DoctorProfileRepository $doctorProfileRepository
    ) {}

    public function getAllDoctors(array $filters = [], bool $onlyAvailable = false): Collection
    {
        return $this->doctorProfileRepository->getAll($filters, $onlyAvailable);
    }

    public function getDoctorById(int $id): ?DoctorProfile
    {
        return $this->doctorProfileRepository->findById($id);
    }

    public function getProfileByUserId(int $userId): ?DoctorProfile
    {
        return $this->doctorProfileRepository->findByUserId($userId);
    }

    public function createDoctor(array $data): DoctorProfile
    {
        if (empty($data['user_id'])) {
            $user = \App\Models\User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
                'role_id' => \App\Models\Role::where('name', \App\Models\Role::DOCTOR)->first()->id,
            ]);
            $data['user_id'] = $user->id;
        }

        return $this->doctorProfileRepository->create($data);
    }

    public function updateDoctor(int $id, array $data): DoctorProfile
    {
        $profile = $this->doctorProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Doctor not found');
        }

        $user = $profile->user;
        $userData = [];

        if (isset($data['name'])) {
            $userData['name'] = $data['name'];
            unset($data['name']);
        }
        if (isset($data['phone'])) {
            $userData['phone'] = $data['phone'];
            unset($data['phone']);
        }

        if (isset($data['avatar'])) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $data['avatar']->store('avatars', 'public');
            $userData['avatar'] = $path;
            unset($data['avatar']);
        }

        if (!empty($userData)) {
            $user->update($userData);
        }

        return $this->doctorProfileRepository->update($profile, $data);
    }

    public function updateProfileByUserId(int $userId, array $data): DoctorProfile
    {
        $profile = $this->doctorProfileRepository->findByUserId($userId);
        if (!$profile) {
            throw new \Exception('Doctor profile not found');
        }

        $user = $profile->user;
        $userData = [];

        if (isset($data['name'])) {
            $userData['name'] = $data['name'];
            unset($data['name']);
        }
        if (isset($data['phone'])) {
            $userData['phone'] = $data['phone'];
            unset($data['phone']);
        }

        if (isset($data['avatar'])) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $data['avatar']->store('avatars', 'public');
            $userData['avatar'] = $path;
            unset($data['avatar']);
        }

        if (!empty($userData)) {
            $user->update($userData);
        }

        return $this->doctorProfileRepository->update($profile, $data);
    }

    public function deleteDoctor(int $id): bool
    {
        $profile = $this->doctorProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Doctor not found');
        }
        return $this->doctorProfileRepository->delete($profile);
    }
}
