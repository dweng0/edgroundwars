/// <summary>
/// The commander class contains all the base stats as well as combat stats and assets for rendering in WEBGL
/// It has a one to many relatinship with commander abilities, these abilities are then applied on top of stats the user currently has.
/// </summary>
interface Commander{
    Id: number;
    Name: string;
    Description: string;
    ImgUrl: string;
    AssetsUrl: string;
    BaseHealth: number;
    BaseShield: number;
    BasePower: number;
    BaseSpeed: number;
    BaseAgility: number;
    Level: number;
    ExperiencePoints: number;
}
