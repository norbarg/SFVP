<?php

namespace App\Entity;

use App\Repository\RouteRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RouteRepository::class)]
class Route
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\NotBlank(message: 'Route name is required.')]
    #[Assert\Length(
        min: 2,
        max: 150,
        minMessage: 'Route name must contain at least {{ limit }} characters.',
        maxMessage: 'Route name cannot exceed {{ limit }} characters.'
    )]
    #[ORM\Column(length: 150)]
    private ?string $name = null;

    #[Assert\NotNull(message: 'Duration is required.')]
    #[Assert\Positive(message: 'Duration must be greater than 0.')]
    #[ORM\Column]
    private ?int $duration = null;

    #[Assert\NotBlank(message: 'Difficulty is required.')]
    #[Assert\Choice(
        choices: ['Easy', 'Medium', 'Hard'],
        message: 'Choose Easy, Medium or Hard.'
    )]
    #[ORM\Column(length: 20)]
    private ?string $difficulty = null;

    #[Assert\NotNull(message: 'Country is required.')]
    #[ORM\ManyToOne(inversedBy: 'routes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Country $country = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getDifficulty(): ?string
    {
        return $this->difficulty;
    }

    public function setDifficulty(string $difficulty): static
    {
        $this->difficulty = $difficulty;

        return $this;
    }

    public function getCountry(): ?Country
    {
        return $this->country;
    }

    public function setCountry(?Country $country): static
    {
        $this->country = $country;

        return $this;
    }
}
