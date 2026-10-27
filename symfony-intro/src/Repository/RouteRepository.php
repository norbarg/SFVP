<?php

namespace App\Repository;

use App\Entity\Route;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RouteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Route::class);
    }

    public function findFilteredPaginated(
        ?string $search,
        ?int $countryId,
        string $sort,
        int $page,
        int $perPage,
    ): array {
        $qb = $this->createQueryBuilder('r')
            ->leftJoin('r.country', 'c')
            ->addSelect('c');

        if ($search) {
            $qb
                ->andWhere('LOWER(r.name) LIKE :search')
                ->setParameter(
                    'search',
                    '%' . mb_strtolower($search) . '%',
                );
        }

        if ($countryId) {
            $qb
                ->andWhere('c.id = :countryId')
                ->setParameter(
                    'countryId',
                    $countryId,
                );
        }

        $direction =
            strtolower($sort) === 'desc'
                ? 'DESC'
                : 'ASC';

        $qb->orderBy(
            'r.duration',
            $direction,
        );

        $countQb = clone $qb;

        $total = (int) $countQb
            ->select('COUNT(r.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $routes = $qb
            ->setFirstResult(
                ($page - 1) * $perPage,
            )
            ->setMaxResults($perPage)
            ->getQuery()
            ->getResult();

        return [
            'routes' => $routes,
            'total' => $total,
        ];
    }
}