enum TeamSide {
    red,
    blue,
    spectator
}

interface Team{
    Id: number;
    Side: TeamSide;
    Name: string;

}
